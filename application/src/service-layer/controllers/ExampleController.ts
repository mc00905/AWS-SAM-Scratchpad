import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from 'aws-lambda';
import { ExampleProvider } from '../providers/ExampleProvider';

export const createItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const provider = new ExampleProvider();
    const body = JSON.parse(event.body as string);
    const str = body.str;
    return await provider.createDocument(str).match(
        () => {
            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: 'Success',
                }),
            };
        },
        (e) => {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed',
                }),
            };
        },
    );
};

export const getItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const provider = new ExampleProvider();
    const pathParams = event.pathParameters as APIGatewayProxyEventPathParameters;
    const key = pathParams.key as string;
    return await provider.getDocument(key).match(
        (res) => {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Success',
                    body: res,
                }),
            };
        },
        (e) => {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed',
                }),
            };
        },
    );
};
