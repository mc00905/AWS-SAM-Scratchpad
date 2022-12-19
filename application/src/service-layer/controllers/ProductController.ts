import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { APIGatewayProxyEventFormatter } from '../../middleware/APIGatewayProxyEventFormatter';
import { APIGatewayProxyResultResolver, ResponseLibrary } from '../../middleware/APIGatewayProxyResultResolver';
import { DocumentNotFoundError } from '../../middleware/ErrorLibrary';
import { ProductProvider } from '../providers/ProductProvider';

export class ProductController {
    private provider: ProductProvider;
    constructor(productProvider?: ProductProvider) {
        this.provider = productProvider || new ProductProvider();
    }

    public async createProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const normalisedEvent = APIGatewayProxyEventFormatter(event);
        const body = normalisedEvent.body;
        const name = body.name;
        const description = body.description;
        const res = await this.provider.createProduct(name, description);
        return res.match(
            (res) => {
                return APIGatewayProxyResultResolver(
                    ResponseLibrary.SuccessCreated,
                    'ResourceSuccessfullyCreated',
                    res,
                );
            },
            (e) => {
                return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
            },
        );
    }

    public async getProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const normalisedEvent = APIGatewayProxyEventFormatter(event);
        const pathParams = normalisedEvent.pathParameters;
        const productId = pathParams.productId;
        if (!productId) {
            return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
        }
        const res = await this.provider.getProduct(productId);
        return res.match(
            (res) => {
                return APIGatewayProxyResultResolver(ResponseLibrary.Success, 'Success', res);
            },
            (e) => {
                if (e instanceof DocumentNotFoundError) {
                    return APIGatewayProxyResultResolver(
                        ResponseLibrary.ResourceNotFound,
                        'Product not found',
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
    }

    public async deleteProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const normalisedEvent = APIGatewayProxyEventFormatter(event);
        const pathParams = normalisedEvent.pathParameters;
        const productId = pathParams.productId;
        if (!productId) {
            return APIGatewayProxyResultResolver(ResponseLibrary.BadRequest, 'Missing required param ProductId');
        }
        const req = await this.provider.deleteProduct(productId);
        return req.match(
            () => {
                return APIGatewayProxyResultResolver(ResponseLibrary.SuccessNoContent, 'ResourceSuccessfullyDeleted');
            },
            (e) => {
                return APIGatewayProxyResultResolver(ResponseLibrary.InternalServerError, 'SomethingWentWrong', e);
            },
        );
    }
}
