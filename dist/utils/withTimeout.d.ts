/** Rechaza con `Error("AI request timed out")` si `promise` no termina en `ms` milisegundos. */
export declare function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>;
