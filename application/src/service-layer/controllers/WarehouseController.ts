import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { DocumentNotFoundError } from '../../middleware/ErrorLibrary';
import { WarehouseProvider } from '../providers/WarehouseProvider';

interface CreateWarehouseBody {
    name: string;
    postcode: string;
}

export const createWarehouse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter<CreateWarehouseBody>(event);
    const provider = new WarehouseProvider();
    const body = normalisedEvent.body;
    const name = body.name;
    const postcode = body.postcode;
    const res = await provider.createWarehouse(name, postcode);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessCreated, 'ResourceSuccessfullyCreated', res);
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};

export const getWarehouse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new WarehouseProvider();
    const pathParams = normalisedEvent.pathParameters;
    const warehouseId = pathParams.warehouseId;
    if (!warehouseId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param WarehouseId');
    }
    const res = await provider.getWarehouse(warehouseId);
    return res.match(
        (res) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'Success', res);
        },
        (e) => {
            if (e instanceof DocumentNotFoundError) {
                return APIGatewayProxyResultResolver(
                    ResponseLibrary.ResourceNotFound,
                    'Warehouse not found',
                    e.details,
                );
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

export const deleteWarehouse = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const normalisedEvent = APIGatewayProxyEventFormatter(event);
    const provider = new WarehouseProvider();
    const pathParams = normalisedEvent.pathParameters;
    const warehouseId = pathParams.warehouseId;
    if (!warehouseId) {
        return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param WarehouseId');
    }
    const req = await provider.deleteWarehouse(warehouseId);
    return req.match(
        () => {
            return APIGatewayProxyResultResolver(ResponseLibrary.SuccessNoContent, 'ResourceSuccessfullyDeleted');
        },
        (e) => {
            return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
        },
    );
};
