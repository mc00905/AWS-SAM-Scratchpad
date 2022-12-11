import { ErrorWrapper404, ErrorWrapper500 } from './ErrorWrapper';

export enum ErrorLibrary {
    DocumentNotFoundError = 'DocumentNotFound',
    GenericInternalServerError = 'InternalServerError',
    RouteNotFoundError = 'RouteNotFound',
}

export class GenericInternalServerError extends ErrorWrapper500 {
    constructor(message: string, details: string) {
        super(ErrorLibrary.GenericInternalServerError, message, details);
    }
}

export class RouteNotFoundError extends ErrorWrapper404 {
    constructor(message: string, details?: string) {
        super(ErrorLibrary.RouteNotFoundError, message, details);
    }
}

export class DocumentNotFoundError extends ErrorWrapper404 {
    constructor(message: string, details?: string) {
        console.log('details: ', JSON.stringify(details));
        super(ErrorLibrary.DocumentNotFoundError, message, details);
    }
}
