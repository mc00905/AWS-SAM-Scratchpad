import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { DocumentNotFoundError, GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { v4 as uuidv4 } from 'uuid';
import { EntityTypePrefixes } from '../enums/EntityTypePrefixes';
import { EntityTypes } from '../enums/EntityTypes';
import { WarehouseAgent } from '../../data-layer/data-agents.ts/WarehouseAgent';
import { NormalisedWarehouse, Warehouse } from '../types/Warehouse';

export class WarehouseProvider {
    private agent: WarehouseAgent;

    constructor(agent?: WarehouseAgent) {
        this.agent = agent || new WarehouseAgent();
    }

    public async createWarehouse(
        name: string,
        postcode: string,
    ): Promise<ResultAsync<void, GenericInternalServerError>> {
        const warehouseId = uuidv4();
        const PK = `${EntityTypePrefixes.WAREHOUSE}${warehouseId}`;
        const warehouse: Warehouse = {
            PK,
            SK: PK,
            Name: name,
            Postcode: postcode,
            EntityType: EntityTypes.WAREHOUSE,
        };
        const op = await this.agent.saveWarehouse(warehouse);
        if (op.isOk()) {
            return okAsync(op.value);
        } else {
            return errAsync(op.error);
        }
    }

    public async getWarehouse(
        warehouseId: string,
    ): Promise<ResultAsync<NormalisedWarehouse, DocumentNotFoundError | GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.WAREHOUSE}${warehouseId}`;
        const op = await this.agent.getProduct(PK);
        if (op.isOk()) {
            const value = op.value;
            const item = value.Item;
            if (!item) {
                return errAsync(
                    new DocumentNotFoundError(
                        'Document Not Found',
                        `Warehouse with WarehouseId: ${warehouseId} not found`,
                    ),
                );
            } else {
                const normalisedWarehouse: NormalisedWarehouse = {
                    name: item.Name,
                    postcode: item.Postcode,
                    warhouseId: warehouseId,
                };
                return okAsync(normalisedWarehouse);
            }
        } else {
            return errAsync(op.error);
        }
    }

    public async deleteWarehouse(warehouseId: string): Promise<ResultAsync<void, GenericInternalServerError>> {
        const PK = `${EntityTypePrefixes.WAREHOUSE}${warehouseId}`;
        const op = await this.agent.deleteProduct(PK);
        if (op.isOk()) {
            return okAsync(op.value);
        } else {
            return errAsync(op.error);
        }
    }
}
