import {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEventV2,
} from 'aws-lambda';

export interface SimplifiedEvent {
    body: any;
    headers: APIGatewayProxyEventHeaders;
    pathParameters: APIGatewayProxyEventPathParameters;
    queryParameters: APIGatewayProxyEventQueryStringParameters;
}

export const APIGatewayProxyEventFormatter = (event: APIGatewayProxyEventV2): SimplifiedEvent => {
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