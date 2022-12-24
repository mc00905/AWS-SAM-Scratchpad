import {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEvent,
} from 'aws-lambda';

export interface SimplifiedEvent<B> {
    body: B;
    headers: APIGatewayProxyEventHeaders;
    pathParameters: APIGatewayProxyEventPathParameters;
    queryParameters: APIGatewayProxyEventQueryStringParameters;
}

export const APIGatewayProxyEventFormatter = <B>(event: APIGatewayProxyEvent): SimplifiedEvent<B> => {
    const body: B = event.body ? JSON.parse(event.body) : {};
    const headers = event.headers;
    const queryParameters = event.queryStringParameters || {};
    const pathParameters = event.pathParameters || {};
    return {
        body,
        headers,
        queryParameters,
        pathParameters,
    };
};
