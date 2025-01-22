// app.js
const express = require('express');
require('dotenv').config();
const { generateKeyPair } = require('./keyGeneration');
const { encryptMessage, decryptMessage } = require('./encryption');
const { savePublicKey, getPublicKey } = require('./keyManagement');
const { savePrivateKey, getPrivateKey } = require('./keyVault');

const app = express();
app.use(express.json());

app.post('/generate-keys', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const { publicKey, privateKey } = await generateKeyPair();
    await savePublicKey(userId, publicKey);
   
    await savePrivateKey(userId, privateKey);

    res.json({ userId, publicKey });
  } catch (error) {
    res.status(500).json({ error: 'Key generation failed', details: error.message });
  }
});

app.post('/encrypt', async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ error: 'Sender ID, Receiver ID, and message are required' });
  }
  try {
    const receiverPublicKey = await getPublicKey(receiverId);
    const encryptedData = await encryptMessage(receiverPublicKey, message);
    res.json({ senderId, receiverId, encryptedData });
  } catch (error) {
    res.status(500).json({ error: 'Encryption failed', details: error.message });
  }
});

app.post('/decrypt', async (req, res) => {
  const { userId, encryptedData } = req.body;
  if (!userId || !encryptedData) {
    return res.status(400).json({ error: 'User ID and encrypted data are required' });
  }
  try {
    const privateKey = await getPrivateKey(userId);
    
    const decryptedMessage = await decryptMessage(privateKey, encryptedData);
    res.json({ userId, decryptedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Decryption failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
