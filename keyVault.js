const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');
require('dotenv').config();

// Azure Key Vault Configuration
const vaultName = 'mylw3keyvault'; // Replace with your Key Vault name
const url = `https://${vaultName}.vault.azure.net`;

// Create SecretClient with DefaultAzureCredential
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(url, credential);

/**
 * Save the private key securely in Azure Key Vault
 * @param {string} userId - The ID of the user
 * @param {string} privateKey - The private key to be stored
 */
async function savePrivateKey(userId, privateKey) {
  try {
    const secretName = `privateKey-${userId}`; // Replace ':' with '-'
    const privateKeyBase64 = Buffer.from(privateKey).toString('base64'); // Encode private key
    const secret = await secretClient.setSecret(secretName, privateKeyBase64);
    console.log(`Private key saved to Azure Key Vault for user: ${userId}`);
  } catch (error) {
    console.error('Error saving private key to Azure Key Vault:', error);
    throw error;
  }
}

/**
 * Retrieve the private key from Azure Key Vault
 * @param {string} userId - The ID of the user
 * @returns {Promise<string>} - The private key
 */
async function getPrivateKey(userId) {
  try {
    const secretName = `privateKey-${userId}`; // Match the updated secret name
    const retrievedSecret = await secretClient.getSecret(secretName);
    const privateKey = Buffer.from(retrievedSecret.value, 'base64').toString('utf8'); // Decode private key
    return privateKey;
  } catch (error) {
    console.error('Error retrieving private key from Azure Key Vault:', error);
    throw error;
  }
}

module.exports = {
  savePrivateKey,
  getPrivateKey,
};
