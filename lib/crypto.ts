import crypto from "crypto";

export function encryptPayload(payload: unknown): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function generateRSAKeys(): crypto.KeyPairKeyObjectResult {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
}
