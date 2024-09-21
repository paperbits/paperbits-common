/**
 * Error that contains user-friendly message to be shown in UI or API response.
 */
export class UserError extends Error {
    constructor(message: string) {
        super(message);
        Error.captureStackTrace(this, UserError);
    }

    public toString(): string {
        return `${this.message}`;
    }
}
