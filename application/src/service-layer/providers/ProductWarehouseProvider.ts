import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { EntityTypePrefixes } from '../enums/EntityTypePrefixes';
import { EntityTypes } from '../enums/EntityTypes';
import { ProductWarehouseAgent } from '../../data-layer/data-agents.ts/ProductWarehouseAgent';
import { ProductWarehouse } from '../types/ProductWarehouse';

export class ProductWarehouseProvider {
    private agent: ProductWarehouseAgent;

    constructor(agent?: ProductWarehouseAgent) {
        this.agent = agent || new ProductWarehouseAgent();
    }

    public async addStockOfProductToWarehouse(
        productId: string,
        warehouseId: string,
        quantity: number,
    ): Promise<ResultAsync<void, GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
        const SK = `${EntityTypePrefixes.WAREHOUSE}${warehouseId}`;
        const productWarehouse: ProductWarehouse = {
            PK,
            SK,
            Quantity: quantity,
            EntityType: EntityTypes.PRODUCT_WAREHOUSE,
        };
        const op = await this.agent.addStockOfProductToWarehouse(productWarehouse);
        if (op.isOk()) {
            return okAsync(op.value);
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
