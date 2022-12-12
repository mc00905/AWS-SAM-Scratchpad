import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { ProductWarehouseProvider } from '../providers/ProductWarehouseProvider';

export const addStockOfProductToWarehouse = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ProductWarehouseProvider();
    const pathParams = normalisedEvent.pathParameters;
    const productId = pathParams.productId;
    if (!productId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
    }
    const body = normalisedEvent.body;
    const warehouseId = body.warehouseId;
    const quantity = body.quantity;

    const req = await provider.addStockOfProductToWarehouse(productId, warehouseId, quantity);
    return req.match(
        () => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessCreated, 'ResourceSuccessfullyCreated');
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};

export const getAllStockForProduct = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new ProductWarehouseProvider();
    const pathParams = normalisedEvent.pathParameters;
    const productId = pathParams.productId;
    if (!productId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
    }
    const res = await provider.getAllStockForProduct(productId);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'Success', res);
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e.details);
        },
    );
};
