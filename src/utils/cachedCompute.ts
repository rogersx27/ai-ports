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
export async function withCache<T>(
  cache: IAiCacheRepository,
  scope: string,
  kind: string,
  inputHash: string,
  compute: () => Promise<ComputeResult<T>>
): Promise<T> {
  const cached = await cache.get(scope, kind);
  if (cached && cached.inputHash === inputHash) {
    return JSON.parse(cached.payload) as T;
  }

  const { value, cacheable } = await compute();
  if (cacheable) {
    await cache.set(scope, kind, inputHash, JSON.stringify(value));
  }

  return value;
}
