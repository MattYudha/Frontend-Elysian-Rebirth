import os

login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'
if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert logo back to ElysianTextLogo but keep the centered layout
    old_logo_block = """                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#00d992] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#00d992]">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-[28px] font-bold tracking-tight text-[#00d992]">elysian</span>
                            <span className="text-[28px] font-medium text-slate-300">OS</span>
                        </div>"""
    
    new_logo_block = """                        <div className="flex justify-center mb-4 scale-110">
                            <ElysianTextLogo />
                        </div>"""
    content = content.replace(old_logo_block, new_logo_block)
    
    # Add green ambient glow to the background if it's not there, or replace existing blobs
    # The layout is just a dark background. We can inject a subtle green glow right after the main form container starts.
    # Wait, the main container is in layout.tsx! But we can put it absolute in the login page wrapper.
    # Let's see if there are any existing ambient blobs in login/page.tsx
    # Earlier we saw: <div className="absolute top-[-20%] left-[-10%] ... bg-blue-600/15" />
    if "bg-blue-600/15" in content:
        content = content.replace("bg-blue-600/15", "bg-[#00d992]/10")
        content = content.replace("bg-indigo-600/15", "bg-[#00d992]/10")
    else:
        # If not, add a subtle green glow right before the form
        pass

    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

register_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\register\page.tsx'
if os.path.exists(register_file):
    with open(register_file, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(old_logo_block, new_logo_block)
    
    if "bg-blue-100/50" in content:
        content = content.replace("bg-blue-100/50", "bg-[#00d992]/10")
        content = content.replace("bg-indigo-100/50", "bg-[#00d992]/10")
        
    with open(register_file, 'w', encoding='utf-8') as f:
        f.write(content)

# We should also add a green glow in app/(auth)/layout.tsx just in case
layout_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\layout.tsx'
if os.path.exists(layout_file):
    with open(layout_file, 'r', encoding='utf-8') as f:
        layout_content = f.read()
    
    # Add an absolute green glow to the left panel (the form panel)
    left_panel_start = '<motion.div\n                    layout\n                    transition={layoutTransition}\n                    className="w-full lg:w-[40%] h-full flex flex-col justify-center relative z-20 bg-slate-50 dark:bg-transparent"\n                >'
    left_panel_with_glow = left_panel_start + '\n                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">\n                        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#00d992]/10 rounded-full blur-[140px]" />\n                    </div>'
    
    # Check if already added
    if "bg-[#00d992]/10" not in layout_content and left_panel_start in layout_content:
        layout_content = layout_content.replace(left_panel_start, left_panel_with_glow)
        with open(layout_file, 'w', encoding='utf-8') as f:
            f.write(layout_content)

print("Logo reverted and green glow added!")
