import CryptoJS from 'crypto-js';
import { base64ToBytes, bytesToBase64 } from '../utils/base64';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const deriveKeyWeb = async (seedPhrase: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey('raw', textEncoder.encode(seedPhrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptText = async (plainText: string, seedPhrase: string): Promise<{ cipherText: string; iv: string; salt: string }> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  if (crypto.subtle) {
    const key = await deriveKeyWeb(seedPhrase, salt);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, textEncoder.encode(plainText));
    return {
      cipherText: bytesToBase64(new Uint8Array(encrypted)),
      iv: bytesToBase64(iv),
      salt: bytesToBase64(salt)
    };
  }
  const derived = CryptoJS.PBKDF2(seedPhrase, CryptoJS.enc.Base64.parse(bytesToBase64(salt)), { keySize: 256 / 32, iterations: 250000 });
  const encrypted = CryptoJS.AES.encrypt(plainText, derived, { iv: CryptoJS.enc.Base64.parse(bytesToBase64(iv)) });
  return {
    cipherText: encrypted.toString(),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt)
  };
};

export const decryptText = async (cipherText: string, seedPhrase: string, ivBase64: string, saltBase64: string): Promise<string> => {
  const iv = base64ToBytes(ivBase64);
  const salt = base64ToBytes(saltBase64);
  if (crypto.subtle) {
    const key = await deriveKeyWeb(seedPhrase, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(cipherText));
    return textDecoder.decode(decrypted);
  }
  const derived = CryptoJS.PBKDF2(seedPhrase, CryptoJS.enc.Base64.parse(saltBase64), { keySize: 256 / 32, iterations: 250000 });
  const decrypted = CryptoJS.AES.decrypt(cipherText, derived, { iv: CryptoJS.enc.Base64.parse(ivBase64) });
  const output = decrypted.toString(CryptoJS.enc.Utf8);
  if (!output) {
    throw new Error('Unable to decrypt message');
  }
  return output;
};
