import { err, errAsync, okAsync, ResultAsync } from 'neverthrow';
import { ProductAgent } from '../../data-layer/data-agents.ts/ProductAgent';
import { DocumentNotFoundError, GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { v4 as uuidv4 } from 'uuid';
import { NormalisedProduct, Product } from '../types/Product';
import { EntityTypePrefixes } from '../enums/EntityTypePrefixes';
import { EntityTypes } from '../enums/EntityTypes';

export class ProductProvider {
    private agent: ProductAgent;

    constructor(agent?: ProductAgent) {
        this.agent = agent || new ProductAgent();
    }

    public async createProduct(
        name: string,
        description: string,
    ): Promise<ResultAsync<NormalisedProduct, GenericInternalServerError>> {
        const productId = uuidv4();
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const product: Product = {
            PK,
            SK: PK,
            Name: name,
            Description: description,
            EntityType: EntityTypes.PRODUCT,
        };
        const op = await this.agent.saveProduct(product);
        if (op.isOk()) {
            const normalisedProduct: NormalisedProduct = {
                name: product.Name,
                description: product.Description,
                productId: productId,
            };
            return okAsync(normalisedProduct);
        } else {
            return errAsync(op.error);
        }
    }

    public async getProduct(
        productId: string,
    ): Promise<ResultAsync<NormalisedProduct, DocumentNotFoundError | GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const op = await this.agent.getProduct(PK);
        if (op.isOk()) {
            const value = op.value;
            const item = value.Item;
            if (!item) {
                return errAsync(
                    new DocumentNotFoundError('Document Not Found', `Product with ProductId: ${productId} not found`),
                );
            } else {
                const normalisedProduct: NormalisedProduct = {
                    name: item.Name,
                    description: item.Description,
                    productId: productId,
                };
                return okAsync(normalisedProduct);
            }
        } else {
            return errAsync(op.error);
        }
    }

    public async deleteProduct(productId: string): Promise<ResultAsync<void, GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const op = await this.agent.deleteProduct(PK);
        if (op.isOk()) {
            return okAsync(op.value);
        } else {
            return errAsync(op.error);
        }
    }
}
