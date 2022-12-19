import {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEvent,
} from 'aws-lambda';

export interface SimplifiedEvent {
    body: any;
    headers: APIGatewayProxyEventHeaders;
    pathParameters: APIGatewayProxyEventPathParameters;
    queryParameters: APIGatewayProxyEventQueryStringParameters;
}

export const APIGatewayProxyEventFormatter = (event: APIGatewayProxyEvent): SimplifiedEvent => {
    const body = event.body ? JSON.parse(event.body) : {};
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
