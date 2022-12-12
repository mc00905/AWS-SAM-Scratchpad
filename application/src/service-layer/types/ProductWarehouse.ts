import { EntityTypes } from '../enums/EntityTypes';

export interface NormalisedProductWarehouse {
    productId: string;
    warehouseId: string;
    quantity: number;
}

export interface ProductWarehouse {
    PK: string;
    SK: string;
    Quantity: number;
    EntityType: EntityTypes.PRODUCT_WAREHOUSE;
}
