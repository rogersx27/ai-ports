export class AiUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = "AiUnavailableError";
    }
}
