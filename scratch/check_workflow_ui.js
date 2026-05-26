// check_workflow_ui.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    // Listen to console events
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error') {
            console.log(`[CONSOLE ERROR] ${msg.text()}`);
        } else if (type === 'warning') {
            console.log(`[CONSOLE WARN] ${msg.text()}`);
        } else {
            console.log(`[CONSOLE LOG] ${msg.text()}`);
        }
    });

    page.on('response', async response => {
        if (response.status() === 400 || response.status() === 500) {
            console.log(`[API ERROR ${response.status()}] URL: ${response.url()}`);
            try {
                console.log(`[API ERROR details] Response: ${await response.text()}`);
            } catch (e) {}
        }
    });

    page.on('pageerror', err => {
        console.log(`[PAGE ERROR] ${err.toString()}`);
    });

    console.log("Navigating to login page...");
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    console.log("Entering credentials...");
    await page.fill('input[placeholder="name@company.com"]:visible', 'admin@gmail.com');
    await page.fill('input[placeholder="••••••••"]:visible', 'password');
    
    console.log("Clicking login...");
    await page.click('button[type="submit"]:visible');

    console.log("Waiting for redirection to dashboard...");
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    console.log("Redirection success! Current URL:", page.url());

    const targetUrl = 'http://localhost:3000/workflow?id=bc948a0c-7c5f-4963-b0ae-9ef192af2d6b';
    console.log(`Navigating directly to workflow builder: ${targetUrl}`);
    await page.goto(targetUrl);
    
    console.log("Waiting for loading overlay to disappear...");
    await page.waitForTimeout(5000); // Wait for API calls to settle

    console.log("Current page title:", await page.title());

    // Check count of nodes on canvas before drag & drop
    let initialNodeCount = await page.locator('.react-flow__node').count();
    console.log(`Initial node count on canvas: ${initialNodeCount}`);

    // Let's locate the "Reasoning Engine" component in the sidebar
    const reasoningEngine = page.locator('div:has-text("Reasoning Engine")').first();
    const canvasPane = page.locator('.react-flow__pane');

    console.log("Is Reasoning Engine visible?", await reasoningEngine.isVisible());
    console.log("Is Canvas Pane visible?", await canvasPane.isVisible());

    // Perform drag and drop using custom HTML5 event simulation
    if (await reasoningEngine.isVisible() && await canvasPane.isVisible()) {
        console.log("Simulating HTML5 Drag and Drop events...");
        await page.evaluate(() => {
            const source = Array.from(document.querySelectorAll('div.cursor-grab'))
                                .find(el => el.textContent.includes('Reasoning Engine'));
            const target = document.querySelector('.react-flow__pane');

            if (!source || !target) {
                console.error("Browser: Failed to find source or target element");
                return;
            }

            const dataTransfer = new DataTransfer();

            // 1. Dispatch dragstart
            const dragStartEvent = new DragEvent('dragstart', {
                bubbles: true,
                cancelable: true,
                dataTransfer
            });
            source.dispatchEvent(dragStartEvent);

            // 2. Dispatch dragover on target wrapper
            const dragOverEvent = new DragEvent('dragover', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
                clientX: 600,
                clientY: 400
            });
            target.dispatchEvent(dragOverEvent);

            // 3. Dispatch drop on target
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
                clientX: 600,
                clientY: 400
            });
            target.dispatchEvent(dropEvent);
        });
        console.log("HTML5 Drag and Drop simulation completed.");
        await page.waitForTimeout(3000); // Wait for state update and auto-save
        
        const dragNodeCount = await page.locator('.react-flow__node').count();
        console.log(`Node count on canvas after drag & drop: ${dragNodeCount}`);

        // Now test reloading the page!
        console.log("Reloading page to verify persistence...");
        await page.reload();
        await page.waitForTimeout(5000); // Wait for API calls to settle

        const reloadNodeCount = await page.locator('.react-flow__node').count();
        console.log(`Node count on canvas after reload: ${reloadNodeCount}`);

        if (reloadNodeCount === dragNodeCount) {
            console.log("✅ Success: Reloaded canvas matches previous state! Data was saved and loaded successfully.");
        } else {
            console.log("❌ Failure: Reloaded canvas does NOT match previous state! Data was lost.");
        }
    } else {
        console.log("Could not locate source or target elements for drag-and-drop!");
    }

    // Take screenshot to verify results
    const screenshotPath = path.join(__dirname, 'workflow_builder_test.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    await browser.close();
    console.log("Test finished.");
})();
