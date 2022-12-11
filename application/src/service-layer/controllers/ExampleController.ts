import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { DocumentNotFoundError } from '../../middleware/ErrorLibrary';
import { ExampleProvider } from '../providers/ExampleProvider';

export const createItem = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ExampleProvider();
    const body = normalisedEvent.body;
    const str = body.str;
    return await provider.createDocument(str).match(
        () => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessCreated, 'ResourceSuccessfullyCreated');
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};

export const getItem = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ExampleProvider();
    const pathParams = normalisedEvent.pathParameters;
    const key = pathParams.key;
    if (!key) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param KEY');
    }
    const res = await provider.getDocument(key);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'Success', res);
        },
        (e) => {
            if (e instanceof DocumentNotFoundError) {
                return APIGatewayProxyResultResolver(ResponseLibrary.ResourceNotFound, 'Document not found', e.details);
            } else {
                return APIGatewayProxyResultResolver(
                    ResponseLibrary.InternalServerError,
                    'SomethingWentWrong',
                    e.details,
                );
            }
        },
    );
};
