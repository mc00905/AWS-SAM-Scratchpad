import { APIGatewayProxyHandler } from 'aws-lambda';
import { ProductController } from '../controllers/ProductController';

export const createProduct: APIGatewayProxyHandler = async (event) => {
    const controller = new ProductController();
    return controller.createProduct(event);
};

export const getProduct: APIGatewayProxyHandler = async (event) => {
    const controller = new ProductController();
    return controller.getProduct(event);
};

export const deleteProduct: APIGatewayProxyHandler = async (event) => {
    const controller = new ProductController();
    return controller.deleteProduct(event);
};
