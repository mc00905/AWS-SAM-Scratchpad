import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ProductController } from '../controllers/ProductController';

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const controller = new ProductController();
    return controller.createProduct(event);
};

export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const controller = new ProductController();
    return controller.getProduct(event);
};

export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const controller = new ProductController();
    return controller.deleteProduct(event);
};
