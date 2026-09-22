export function requireApiKey(apiKey, provider) {
    if (!apiKey)
        throw new Error(`Falta la API key de ${provider}.`);
    return apiKey;
}
