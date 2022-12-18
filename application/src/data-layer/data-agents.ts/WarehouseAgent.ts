import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocument,
    GetCommandInput,
    GetCommandOutput,
    PutCommandInput,
    DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { Warehouse } from '../../service-layer/types/Warehouse';

export class WarehouseAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocument;
    private tableName?: string;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocument, tableName?: string) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocument.from(this.dynamoClient);
        this.tableName = tableName || process.env.TABLE_NAME;
    }

    public saveWarehouse(warehouse: Warehouse): ResultAsync<Warehouse, GenericInternalServerError> {
        const params: PutCommandInput = {
            TableName: this.tableName,
            Item: warehouse,
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.put(params);
                return warehouse;
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getProduct(PK: string): ResultAsync<GetCommandOutput, GenericInternalServerError> {
        const params: GetCommandInput = {
            TableName: this.tableName,
            Key: {
                PK,
                SK: PK,
            },
        };
        return ResultAsync.fromPromise(this.dynamoDocumentClient.get(params), (e) => {
            return new GenericInternalServerError('Failed to fetch from Dynamo', JSON.stringify(e));
        });
    }

    public deleteProduct(PK: string): ResultAsync<void, GenericInternalServerError> {
        const params: DeleteCommandInput = {
            TableName: this.tableName,
            Key: {
                PK,
                SK: PK,
            },
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.delete(params);
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to delete from Dynamo', JSON.stringify(e));
            },
        );
    }
}
