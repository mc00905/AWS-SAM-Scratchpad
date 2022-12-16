import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { DocumentNotFoundError } from '../../middleware/ErrorLibrary';
import { ProductProvider } from '../providers/ProductProvider';

export const createProduct = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ProductProvider();
    const body = normalisedEvent.body;
    const name = body.name;
    const description = body.description;
    const res = await provider.createProduct(name, description);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessCreated, 'ResourceSuccessfullyCreated', res);
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};

export const getProduct = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ProductProvider();
    const pathParams = normalisedEvent.pathParameters;
    const productId = pathParams.productId;
    if (!productId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
    }
    const res = await provider.getProduct(productId);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'Success', res);
        },
        (e) => {
            if (e instanceof DocumentNotFoundError) {
                return APIGatewayProxyResultResolver(ResponseLibrary.ResourceNotFound, 'Product not found', e.details);
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

export const deleteProduct = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ProductProvider();
    const pathParams = normalisedEvent.pathParameters;
    const productId = pathParams.productId;
    if (!productId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
    }
    const req = await provider.deleteProduct(productId);
    return req.match(
        () => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessNoContent, 'ResourceSuccessfullyDeleted');
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};
