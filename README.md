# End-to-End Encryption (E2EE) Application in Node.js

This project demonstrates how to implement end-to-end encryption (E2EE) in a Node.js application using a combination of AES and RSA encryption. The solution uses Azure Key Vault for securely storing private keys and Redis for caching public keys.

## Features

- **Key Generation**: RSA key pairs are generated for each user (public and private keys).
- **Encryption**: A unique AES key is generated to encrypt messages. The AES key is then encrypted using the recipient's public key (RSA).
- **Decryption**: The recipient decrypts the AES key using their private key (RSA), and then uses the AES key to decrypt the message.
- **Key Storage**: Public keys are stored in Redis, and private keys are securely stored in Azure Key Vault.

## Prerequisites

- Node.js (v14 or higher)
- Redis (local or Azure Cache for Redis)
- Azure subscription with access to **Azure Key Vault**
- Azure CLI (optional, for setting up Azure resources)

### Installing Dependencies

```bash
npm install