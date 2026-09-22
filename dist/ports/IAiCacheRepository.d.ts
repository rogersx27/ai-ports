export interface AiCacheEntry {
    inputHash: string;
    payload: string;
}
/**
 * Almacén de resultados de IA, con clave `(scope, kind)`: `scope` agrupa los
 * resultados (ej. el ID de un proyecto) y `kind` distingue qué se calculó.
 */
export interface IAiCacheRepository {
    get(scope: string, kind: string): Promise<AiCacheEntry | null>;
    set(scope: string, kind: string, inputHash: string, payload: string): Promise<void>;
}
