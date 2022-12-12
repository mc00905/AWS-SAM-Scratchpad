import { APIGatewayProxyResult } from 'aws-lambda';

export enum ResponseLibrary {
    Success = 200,
    SuccessCreated = 201,
    SuccessNoContent = 204,
    BadRequest = 400,
    ResourceNotFound = 404,
    InternalServerError = 500,
}

export const APIGatewayProxyResultResolver = (
    status: ResponseLibrary,
    message: string,
    payload?: any,
): APIGatewayProxyResult => {
    switch (status) {
        case ResponseLibrary.Success:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                    data: payload,
                }),
            };
        case ResponseLibrary.SuccessCreated:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                }),
            };
        case ResponseLibrary.SuccessNoContent:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                }),
            };
        case ResponseLibrary.BadRequest:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                    error: payload || 'Missing required parameter',
                }),
            };
        case ResponseLibrary.ResourceNotFound:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                    error: payload || 'Resource Not Found',
                }),
            };
        case ResponseLibrary.InternalServerError:
            return {
                statusCode: status,
                body: JSON.stringify({
                    message,
                    error: payload,
                }),
            };
    }
};
