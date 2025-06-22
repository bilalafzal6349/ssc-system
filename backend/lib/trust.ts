// lib / trust.ts;
interface TrustParams {
  Tpi: number;
  Tai: number;
  Tci: number;
  Ci: number;
  beta: number;
}

export function calculateInitialTrust({
  Tpi,
  Tai,
  Tci,
  Ci,
  beta,
}: TrustParams): number {
  return 0.3 * Tpi + 0.2 * Tai + 0.2 * Tci + 0.3 * Ci + beta;
}
