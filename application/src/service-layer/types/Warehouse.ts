import { EntityTypes } from '../enums/EntityTypes';

export interface NormalisedWarehouse {
    warhouseId: string;
    name: string;
    postcode: string;
}

export interface Warehouse {
    PK: string;
    SK: string;
    Name: string;
    Postcode: string;
    EntityType: EntityTypes.WAREHOUSE;
}
