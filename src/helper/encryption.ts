import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY!;
//const iv = crypto.randomBytes(16);

const encrypt = async (text: crypto.BinaryLike) => {
    const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
    if (!secretKey) {
        throw new Error("Encryption key is not defined");
    }
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

const decrypt = async ({ iv, encryptedData }: { iv: string, encryptedData: string }) => {
    if (!secretKey) {
        throw new Error("Encryption key is not defined");
    }
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export {
    encrypt,
    decrypt
}