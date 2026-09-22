import { createHash } from "node:crypto";
/** SHA-256 del JSON de `value`: identifica el contenido que generó un resultado de IA. */
export function hashContent(value) {
    return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
