export interface AdapterOptions {
  apiKey: string;
  /** Modelo a usar; cada adaptador tiene su propio default. */
  model?: string;
}

export function requireApiKey(apiKey: string | undefined, provider: string): string {
  if (!apiKey) throw new Error(`Falta la API key de ${provider}.`);
  return apiKey;
}
