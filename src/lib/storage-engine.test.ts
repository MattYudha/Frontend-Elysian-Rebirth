import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEncryptedIdbStorage } from './storage-engine';
import { get, set, del } from 'idb-keyval';
import CryptoJS from 'crypto-js';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
}));

describe('createEncryptedIdbStorage (Contract Test)', () => {
    const TEST_KEY = 'test-key';
    const TEST_SECRET = 'super-secret-password';
    const storage = createEncryptedIdbStorage({ key: TEST_KEY, secret: TEST_SECRET });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('setItem should encrypt data before saving to IDB', async () => {
        const data = { foo: 'bar' };
        await storage.setItem('test-item', { state: data, version: 1 });

        expect(set).toHaveBeenCalledTimes(1);

        // Verify the arguments passed to set()
        const [key, value] = vi.mocked(set).mock.calls[0];
        expect(key).toBe(`${TEST_KEY}:test-item`);

        // The value should be an encrypted string, not the original object
        expect(typeof value).toBe('string');
        expect(value).not.toContain('foo'); // Should be obfuscated

        // Verify we can decrypt it manually to check correctness
        const bytes = CryptoJS.AES.decrypt(value as string, TEST_SECRET);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        expect(decrypted).toEqual({ state: data, version: 1 });
    });

    it('getItem should decrypt data retrieved from IDB', async () => {
        const originalData = { state: { foo: 'bar' }, version: 1 };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(originalData), TEST_SECRET).toString();

        // Mock IDB returning encrypted string
        vi.mocked(get).mockResolvedValue(encrypted);

        const result = await storage.getItem('test-item');

        expect(get).toHaveBeenCalledWith(`${TEST_KEY}:test-item`);
        expect(result).toEqual(originalData);
    });

    it('getItem should return null if decryption fails (fail-safe)', async () => {
        // Return garbage string that isn't valid AES
        vi.mocked(get).mockResolvedValue('invalid-encrypted-string');

        const result = await storage.getItem('test-item');

        expect(result).toBeNull();
    });

    it('removeItem should delete from IDB', async () => {
        await storage.removeItem('test-item');
        expect(del).toHaveBeenCalledWith(`${TEST_KEY}:test-item`);
    });
});
