'use client';

import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

interface RiveAvatarProps {
    emailValue: string;
    isEmailFocused: boolean;
    isPasswordFocused: boolean;
    submitStatus: 'idle' | 'success' | 'error';
}

export default function RiveLoginAvatar({
    emailValue,
    isEmailFocused,
    isPasswordFocused,
    submitStatus
}: RiveAvatarProps) {

    // STATE MACHINE CONFIGURATION
    // WARN: State Machine name must be EXACT match. If "Login Machine" fails, try "State Machine 1".
    const STATE_MACHINE_NAME = "Login Machine";

    const { rive, RiveComponent } = useRive({
        src: '/assets/login.riv',
        stateMachines: STATE_MACHINE_NAME,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    // INPUTS BINDING
    const isCheckingInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isChecking');
    const numLookInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'numLook');
    const isHandsUpInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isHandsUp');
    const trigSuccessInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'trigSuccess');
    const trigFailInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'trigFail');

    // Debugging: Log if inputs are not found
    useEffect(() => {
        if (rive) {
            // console.log("Rive loaded", rive.contents);
            const inputs = rive.stateMachineInputs(STATE_MACHINE_NAME);
            if (!inputs && rive.contents) {
                console.warn(`Rive State Machine "${STATE_MACHINE_NAME}" not found. Available animations/machines may differ.`);
            }
        }
    }, [rive]);


    // REACTIVE LOGIC (The Bridge)

    // 1. Handle "Looking" (Email Focus)
    useEffect(() => {
        if (isCheckingInput) {
            isCheckingInput.value = isEmailFocused;
        }
    }, [isEmailFocused, isCheckingInput]);

    // 2. Handle "Eye Tracking" (Length of text)
    useEffect(() => {
        if (numLookInput && isEmailFocused) {
            // Mapping length 0-30 to value 0-100 logic
            // e.g. each char is ~3%
            const lookValue = Math.min(emailValue.length * 3, 100);
            numLookInput.value = lookValue;
        }
    }, [emailValue, isEmailFocused, numLookInput]);

    // 3. Handle "Peeking" (Password Focus)
    useEffect(() => {
        if (isHandsUpInput) {
            isHandsUpInput.value = isPasswordFocused;
        }
    }, [isPasswordFocused, isHandsUpInput]);

    // 4. Handle Submit Result
    useEffect(() => {
        if (submitStatus === 'success' && trigSuccessInput) {
            trigSuccessInput.fire();
        } else if (submitStatus === 'error' && trigFailInput) {
            trigFailInput.fire();
        }
    }, [submitStatus, trigSuccessInput, trigFailInput]);

    return (
        // Fixed height container to prevent CLS as per professor's request
        // Fixed height container with CSS Filter Hack to "bleach" the baked-in grey background to white
        <div
            className="w-full h-full relative cursor-pointer"
            aria-label="Interactive Login Avatar"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
        >
            <RiveComponent className="w-full h-full" />
        </div>
    );
}
