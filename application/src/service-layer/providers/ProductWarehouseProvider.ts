import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { EntityTypePrefixes } from '../enums/EntityTypePrefixes';
import { EntityTypes } from '../enums/EntityTypes';
import { ProductWarehouseAgent } from '../../data-layer/data-agents.ts/ProductWarehouseAgent';
import { ProductWarehouse } from '../types/ProductWarehouse';
import { ProductWarehousePublishers } from '../publishers/ProductWarehousePublishers';

export class ProductWarehouseProvider {
    private agent: ProductWarehouseAgent;
    private publishers: ProductWarehousePublishers;

    constructor(agent?: ProductWarehouseAgent, publishers?: ProductWarehousePublishers) {
        this.agent = agent || new ProductWarehouseAgent();
        this.publishers = publishers || new ProductWarehousePublishers();
    }

    public async addStockOfProductToWarehouse(
        productId: string,
        warehouseId: string,
        quantity: number,
    ): Promise<ResultAsync<ProductWarehouse, GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const SK = `${EntityTypePrefixes.WAREHOUSE}${warehouseId}`;
        const productWarehouse: ProductWarehouse = {
            PK,
            SK,
            Quantity: quantity,
            EntityType: EntityTypes.PRODUCT_WAREHOUSE,
        };
        const op = await this.agent.addStockOfProductToWarehouse(productWarehouse);
        await this.publishers.publish('Added an item!', 'addStockOfProductToWarehouse');
        if (op.isOk()) {
            return okAsync(productWarehouse);
        } else {
            return errAsync(op.error);
        }
    }

    public async getAllStockForProduct(productId: string): Promise<ResultAsync<any, GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const req = await this.agent.getAllStockForProduct(PK);
        if (req.isOk()) {
            const value = req.value;
            return okAsync(value.Items || []);
        } else {
            return errAsync(req.error);
        }
    }
}
