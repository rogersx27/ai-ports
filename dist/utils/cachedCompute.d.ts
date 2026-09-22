import type { IAiCacheRepository } from "../ports/IAiCacheRepository.ts";
export interface ComputeResult<T> {
    value: T;
    /** Si el resultado se puede cachear -- false para un resultado degradado/de respaldo. */
    cacheable: boolean;
}
/**
 * Devuelve el valor cacheado de `(scope, kind)` si su `inputHash` sigue coincidiendo;
 * si no, ejecuta `compute()` y guarda el resultado solo cuando es cacheable (un
 * resultado degradado de la IA nunca se cachea, para que la siguiente llamada reintente).
 */
export declare function withCache<T>(cache: IAiCacheRepository, scope: string, kind: string, inputHash: string, compute: () => Promise<ComputeResult<T>>): Promise<T>;
