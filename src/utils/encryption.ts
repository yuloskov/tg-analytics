import { base64ToArrayBuffer, arrayBufferToBase64 } from './base64';

// Generate a random encryption key
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// Export the key as base64 string for URL sharing
export async function exportKey(key: CryptoKey): Promise<string> {
  const rawKey = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(rawKey);
}

// Import a key from base64 string
export async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(keyBase64);
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return arrayBufferToBase64(combined);
}

// Decrypt data
export async function decryptData(encryptedBase64: string, key: CryptoKey): Promise<string> {
  const combined = base64ToArrayBuffer(encryptedBase64);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
    },
    key,
    encryptedData
  );

  return new TextDecoder().decode(decryptedData);
} 