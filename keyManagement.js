const redis = require('async-redis');

// Redis URL for local connection
const redisUrl = 'redis://localhost:6379';

// Create the Redis client
const client = redis.createClient(redisUrl);

// Connection event
client.on('connect', () => {
  console.log('Redis client connected to local Redis instance');
});

// Error handling event
client.on('error', (err) => {
  console.error('Redis error:', err);
});

/**
 * Save the public key of a user to Redis
 * @param {string} userId - The ID of the user
 * @param {string} publicKey - The public key of the user
 */
async function savePublicKey(userId, publicKey) {
  try {
    console.log('Saving public key...');
    await client.set(`publicKey:${userId}`, publicKey);
    console.log(`Public key saved for user: ${userId}`);
  } catch (error) {
    console.error('Error saving public key to Redis:', error);
    throw error;
  }
}

/**
 * Retrieve the public key of a user from Redis
 * @param {string} userId - The ID of the user
 * @returns {Promise<string>} - The public key of the user
 */
async function getPublicKey(userId) {
  try {
    const publicKey = await client.get(`publicKey:${userId}`);
    if (!publicKey) {
      throw new Error(`Public key not found for user: ${userId}`);
    }
    return publicKey;
  } catch (error) {
    console.error('Error retrieving public key from Redis:', error);
    throw error;
  }
}

module.exports = {
  savePublicKey,
  getPublicKey,
};
