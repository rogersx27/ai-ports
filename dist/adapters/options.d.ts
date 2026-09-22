export interface AdapterOptions {
    apiKey: string;
    /** Modelo a usar; cada adaptador tiene su propio default. */
    model?: string;
}
export declare function requireApiKey(apiKey: string | undefined, provider: string): string;
