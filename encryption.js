// encryption.js
const crypto = require('crypto');

async function encryptMessage(publicKey, message) {
  const aesKey = crypto.randomBytes(32); // Generate a 256-bit AES key
  const iv = crypto.randomBytes(16); // Initialization vector for AES

  // Encrypt the message with AES
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'base64');
  encryptedMessage += cipher.final('base64');

  // Encrypt the AES key with RSA-OAEP
  const encryptedAesKey = crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256', // Use SHA-256 for OAEP
      },
      aesKey
    )
    .toString('base64');

  return {
    encryptedMessage,
    encryptedAesKey,
    iv: iv.toString('base64'), // Send the IV along with the encrypted message and key
  };
}

async function decryptMessage(privateKey, encryptedData) {
  const { encryptedMessage, encryptedAesKey, iv } = encryptedData;

  // Decrypt the AES key with RSA-OAEP
  const aesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256', // Use SHA-256 for OAEP
    },
    Buffer.from(encryptedAesKey, 'base64')
  );

  // Decrypt the message with AES
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
  let decryptedMessage = decipher.update(encryptedMessage, 'base64', 'utf8');
  decryptedMessage += decipher.final('utf8');

  return decryptedMessage;
}

module.exports = { encryptMessage, decryptMessage };
