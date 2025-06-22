// lib / sawtooth.ts;
import axios from "axios";
import { encryptPayload } from "./crypto";

const SAWTOOTH_API: string = process.env.SAWTOOTH_API || "http://rest-api:8008";

export async function submitToSawtooth(payload: unknown): Promise<unknown> {
  try {
    const encryptedPayload = encryptPayload(payload);
    const response = await axios.post(
      `${SAWTOOTH_API}/transactions`,
      {
        payload: encryptedPayload,
        family: "trust_chain",
        version: "1.0",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Sawtooth error: ${(error as Error).message}`);
  }
}

export async function fetchSawtoothLogs(): Promise<unknown> {
  try {
    const response = await axios.get(`${SAWTOOTH_API}/transactions`);
    return response.data;
  } catch (error) {
    throw new Error(`Sawtooth error: ${(error as Error).message}`);
  }
}
