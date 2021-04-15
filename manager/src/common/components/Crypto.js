const crypto = require('crypto');

const ENCRYPTION_KEY = "tuLjUwrMvSiPs3wgkmBQvzBYeqiArHMK"
const BUFFER_KEY = "6V3tDjYwpHLLuRuN"
const ENCRYPT_METHOD = "aes-256-cbc"
const ENCODING = "hex"

export function getEncryptedString(id) {

    const raw = String(id)
    let iv = Buffer.from(BUFFER_KEY)
    let cipher = crypto.createCipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(raw)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return encrypted.toString(ENCODING)
}

export function getDecryptedString(encrypted) {
    let iv = Buffer.from(BUFFER_KEY)
    let encryptedText = Buffer.from(encrypted, ENCODING)
    let decipher = crypto.createDecipheriv(ENCRYPT_METHOD, Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)
  
    decrypted = Buffer.concat([decrypted, decipher.final()])
  
    return decrypted.toString()
}