const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Derive a per-user encryption key from the master secret + user ID.
 * This ensures each user's data is encrypted with a unique key.
 */
const deriveKey = (userId) => {
    const masterSecret = process.env.ENCRYPTION_MASTER_KEY || process.env.JWT_SECRET;
    return crypto
        .createHash('sha256')
        .update(`${masterSecret}:${userId}`)
        .digest();
};

/**
 * Encrypt data using AES-256-GCM.
 * Returns: base64 string containing IV + encrypted data + auth tag.
 */
const encrypt = (plainText, userId) => {
    const key = deriveKey(userId);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Combine: IV + AuthTag + EncryptedData
    const combined = Buffer.concat([
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
    ]);

    return combined.toString('base64');
};

/**
 * Decrypt data encrypted with AES-256-GCM.
 * Input: base64 string from encrypt()
 */
const decrypt = (encryptedBase64, userId) => {
    const key = deriveKey(userId);
    const combined = Buffer.from(encryptedBase64, 'base64');

    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports = { encrypt, decrypt };
