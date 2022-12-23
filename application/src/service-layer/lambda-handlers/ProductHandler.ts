import { APIGatewayProxyHandler } from 'aws-lambda';
import { ProductController } from '../controllers/ProductController';

const controller = new ProductController();

export const createProduct: APIGatewayProxyHandler = async (event) => {
    return controller.createProduct(event);
};

export const getProduct: APIGatewayProxyHandler = async (event) => {
    return controller.getProduct(event);
};

export const deleteProduct: APIGatewayProxyHandler = async (event) => {
    return controller.deleteProduct(event);
};
