// Convert ArrayBuffer to URL-safe base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  const base64 = btoa(binary);
  // Make base64 URL safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Convert URL-safe base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Restore base64 characters and padding
  let normalBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (normalBase64.length % 4) {
    normalBase64 += '=';
  }
  
  const binary = atob(normalBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
} 