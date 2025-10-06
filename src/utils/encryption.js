import CryptoJS from 'crypto-js';

// Generate a random salt for encryption
export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

// Generate initialization vector for AES encryption
export const generateIV = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

// Derive encryption key from master password and salt
export const deriveKey = (masterPassword, salt) => {
  // Use a default value if masterPassword is empty
  const password = masterPassword || 'DEFAULT_ENCRYPTION_KEY';
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
};

// Encrypt data using AES-256
export const encryptData = (data, masterPassword) => {
  const salt = generateSalt();
  const iv = generateIV();
  const key = deriveKey(masterPassword, salt);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    encryptedData: encrypted.toString(),
    iv,
    salt
  };
};

// Decrypt data using AES-256
export const decryptData = (encryptedData, iv, salt, masterPassword) => {
  try {
    const key = deriveKey(masterPassword, salt);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
  }
};