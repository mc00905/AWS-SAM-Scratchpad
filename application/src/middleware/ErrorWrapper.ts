export class ErrorWrapper extends Error {
    public details: string;
    public name: string;
    public message: string;
    public status: number;

    constructor(status: number, errorIdentifier: string, message: string, details = '') {
        super(message);
        this.details = details;
        this.name = errorIdentifier;
        this.message = message;
        this.status = status;
    }
}
export class ErrorWrapper404 extends ErrorWrapper {
    constructor(errorIdentifier: string, message: string, details = '') {
        super(404, errorIdentifier, message, details);
    }
}
export class ErrorWrapper500 extends ErrorWrapper {
    constructor(errorIdentifier: string, message: string, details = '') {
        super(500, errorIdentifier, message, details);
    }
}
