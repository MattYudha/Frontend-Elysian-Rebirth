import { type PersistStorage, type StorageValue } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import CryptoJS from 'crypto-js';

type Options = {
    key: string; // root key in indexedDB
    secret: string; // encryption secret (see security notes)
};

/**
 * IMPORTANT SECURITY NOTE:
 * If secret is public (NEXT_PUBLIC_*), this is obfuscation, not strong security.
 * It prevents casual inspection in DevTools but does not protect against determined attackers.
 */
export function createEncryptedIdbStorage<S>(opts: Options): PersistStorage<S> {
    const { key, secret } = opts;
    const isServer = typeof window === 'undefined' || !window.indexedDB;

    return {
        async getItem(name: string): Promise<StorageValue<S> | null> {
            if (isServer) return null;
            try {
                const raw = await get<string>(`${key}:${name}`);
                if (!raw) return null;

                // decrypt
                const bytes = CryptoJS.AES.decrypt(raw, secret);
                const json = bytes.toString(CryptoJS.enc.Utf8);

                if (!json) return null;

                return JSON.parse(json) as StorageValue<S>;
            } catch (e) {
                console.warn('[persist] getItem failed, returning null to safe reset:', e);
                return null;
            }
        },

        async setItem(name: string, value: StorageValue<S>): Promise<void> {
            if (isServer) return;
            try {
                const json = JSON.stringify(value);
                const cipher = CryptoJS.AES.encrypt(json, secret).toString();
                await set(`${key}:${name}`, cipher);
            } catch (e) {
                console.warn('[persist] setItem failed:', e);
            }
        },

        async removeItem(name: string): Promise<void> {
            if (isServer) return;
            try {
                await del(`${key}:${name}`);
            } catch (e) {
                console.warn('[persist] removeItem failed:', e);
            }
        },
    };
}
