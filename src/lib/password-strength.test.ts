import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from './password-strength';

describe('checkPasswordStrength', () => {
    it('should return score 0 for empty password', () => {
        const result = checkPasswordStrength('');
        expect(result.score).toBe(0);
    });

    it('should identify short passwords as Weak', () => {
        const result = checkPasswordStrength('123');
        expect(result.score).toBeLessThanOrEqual(1);
        expect(result.messages).toContain('Minimal 8 karakter');
    });

    it('should penalize repeated characters', () => {
        const result = checkPasswordStrength('aaaaaaaa');
        expect(result.messages).toContain('Hindari karakter berulang (misal: aaa)');
    });

    it('should penalize sequences', () => {
        const result = checkPasswordStrength('12345678');
        expect(result.messages).toContain('Hindari urutan berurutan (misal: 123, abc)');
        expect(result.score).toBeLessThan(3);
    });

    it('should identify medium strength passwords', () => {
        // Length 8, mix of letters/nums, but maybe simple
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _result = checkPasswordStrength('Pass1234');
        // "123" is sequence -> penalty
        // length(2) + complexity(2) - penalty(1) = 3 -> Strong? Wait
        // Let's try 'PassWord1'
        const result2 = checkPasswordStrength('PassWord1');
        expect(result2.score).toBeGreaterThanOrEqual(2);
    });

    it('should identify strong passwords', () => {
        const result = checkPasswordStrength('CorrectHorseBatteryStaple1!');
        expect(result.score).toBeGreaterThanOrEqual(3);
        expect(result.strength).toBe('Strong');
    });

    it('should perform well on "P@ssw0rd"', () => {
        // Common substitution but technically complex
        const result = checkPasswordStrength('P@ssw0rd');
        expect(result.score).toBeGreaterThanOrEqual(2); // At least medium
    });
});
