# Implementation Plan: Rive Animation Migration ("Teddy Bear" Auth)

**Objective:**
Port the interactive "Teddy Bear" Rive animation from the Android codebase to the Next.js/React frontend (Frontend-Elysian-Rebirth), ensuring full state-machine interactivity.

**Tech Stack:** Next.js (App Router), TypeScript, `@rive-app/react-canvas`.

## 1. Asset Migration
*   **Source:** `[AndroidProject]/app/src/main/res/raw/login.riv`
*   **Destination:** `[NextJsProject]/public/assets/login.riv`
*   **Note:** Ensure the file is placed in public to be accessible via URL.

## 2. Dependencies
Install the React runtime for Rive:
```bash
npm install @rive-app/react-canvas
```

## 3. Component Development (`src/components/ui/rive-login-avatar.tsx`)
Create a dedicated component to encapsulate the Rive logic.

**State Machine Config**
*   **Machine Name:** "Login Machine" (Verify this! If it fails, try "State Machine 1").
*   **Canvas Layout:** Use `Fit.Cover` and `Alignment.Center`.

**Inputs Implementation (useStateMachineInput)**
Map the React state to these Rive inputs:

| Input Name | Type | Description | Trigger Condition |
| :--- | :--- | :--- | :--- |
| `isChecking` | Boolean | Teddy looks down | `onFocus` (Email input) |
| `numLook` | Number | Eye tracking (0-100) | `onChange` (Email length * multiplier) |
| `isHandsUp` | Boolean | Hands cover eyes | `onFocus` (Password input) |
| `trigSuccess` | Trigger | Success Animation | Auth API returns 200 OK |
| `trigFail` | Trigger | Failure Animation | Auth API returns 400/500 |

## 4. Integration Strategy (`app/login/page.tsx`)
*   **Container:** Place the `<RiveLoginAvatar />` component above the login form.
*   **Style Requirement:** Enforce a fixed height (e.g., `h-[200px]`) on the container to prevent Cumulative Layout Shift (CLS) during loading.
*   **State Wiring:**
    *   Use `useState` for `isEmailFocused` and `isPasswordFocused`.
    *   Attach `onFocus` and `onBlur` handlers to the Shadcn UI `<Input />` components.
    *   Pass `form.watch('email')` value to the avatar for the `numLook` calculation.

## 5. Verification Checklist (Definition of Done)
*   [ ] **Asset Loading:** No 404 errors in network tab for `login.riv`.
*   [ ] **Console Check:** No warnings about "State Machine not found" (Confirming name is correct).
*   [ ] **Interactivity:**
    *   Teddy looks at cursor when typing email.
    *   Teddy covers eyes when password field is focused.
    *   Teddy uncovers eyes when password field is blurred.
*   [ ] **Feedback:** Animation triggers correctly on Login Success vs Login Fail.
