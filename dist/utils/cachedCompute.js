/**
 * Devuelve el valor cacheado de `(scope, kind)` si su `inputHash` sigue coincidiendo;
 * si no, ejecuta `compute()` y guarda el resultado solo cuando es cacheable (un
 * resultado degradado de la IA nunca se cachea, para que la siguiente llamada reintente).
 */
export async function withCache(cache, scope, kind, inputHash, compute) {
    const cached = await cache.get(scope, kind);
    if (cached && cached.inputHash === inputHash) {
        return JSON.parse(cached.payload);
    }
    const { value, cacheable } = await compute();
    if (cacheable) {
        await cache.set(scope, kind, inputHash, JSON.stringify(value));
    }
    return value;
}
