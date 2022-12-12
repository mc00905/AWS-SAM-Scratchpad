import { EntityTypes } from '../enums/EntityTypes';

export interface NormalisedProduct {
    productId: string;
    name: string;
    description: string;
}

export interface Product {
    PK: string;
    SK: string;
    Name: string;
    Description: string;
    EntityType: EntityTypes.PRODUCT;
}
