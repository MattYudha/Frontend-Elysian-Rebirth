export type PasswordStrength = 'Too Weak' | 'Weak' | 'Medium' | 'Strong';

export interface PasswordFeedback {
    strength: PasswordStrength;
    score: 0 | 1 | 2 | 3 | 4;
    messages: string[];
}

export const checkPasswordStrength = (password: string): PasswordFeedback => {
    const messages: string[] = [];

    if (!password) {
        return { strength: 'Too Weak', score: 0, messages: [] };
    }

    // 1. Length Check
    if (password.length < 8) messages.push('Minimal 8 karakter');

    // 2. Complexity Check
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const complexityCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (complexityCount < 3) messages.push('Gunakan kombinasi huruf besar, kecil, angka, & simbol');

    // 3. Repeated Characters Check (e.g., "aaaaa")
    if (/(.)\1{2,}/.test(password)) {
        messages.push('Hindari karakter berulang (misal: aaa)');
    }

    // 4. Sequential Characters Check (e.g., "123", "abc")
    // Simple check for common sequences
    const sequences = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def', 'efg', 'qwerty', 'asdf'];
    const lowerPassword = password.toLowerCase();

    const hasSequence = sequences.some(seq => lowerPassword.includes(seq));
    if (hasSequence) {
        messages.push('Hindari urutan berurutan (misal: 123, abc)');
    }

    // Normalize Score
    // Base score from length (0-1) + complexity (0-1) - penalties
    // Let's refine the scoring to map to 0-4

    let intendedScore = 0;
    if (password.length > 5) intendedScore++;
    if (password.length >= 8) intendedScore++;
    if (complexityCount >= 2) intendedScore++;
    if (complexityCount >= 3) intendedScore++;

    // Penalties
    if (/(.)\1{2,}/.test(password)) intendedScore--;
    if (hasSequence) intendedScore--;

    intendedScore = Math.max(0, Math.min(4, intendedScore));

    let strength: PasswordStrength = 'Too Weak';
    if (intendedScore <= 1) strength = 'Weak';
    else if (intendedScore === 2) strength = 'Medium';
    else if (intendedScore >= 3) strength = 'Strong';

    return {
        strength,
        score: intendedScore as 0 | 1 | 2 | 3 | 4,
        messages
    };
};
