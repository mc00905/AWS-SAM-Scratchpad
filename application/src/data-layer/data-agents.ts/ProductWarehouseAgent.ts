import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, PutCommandInput, QueryCommandOutput, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { EntityTypePrefixes } from '../../service-layer/enums/EntityTypePrefixes';
import { ProductWarehouse } from '../../service-layer/types/ProductWarehouse';

export class ProductWarehouseAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocument;
    private tableName?: string;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocument, tableName?: string) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocument.from(this.dynamoClient);
        this.tableName = tableName || process.env.TABLE_NAME;
    }

    public addStockOfProductToWarehouse(
        productWarehouse: ProductWarehouse,
    ): ResultAsync<void, GenericInternalServerError> {
        const params: PutCommandInput = {
            TableName: this.tableName,
            Item: productWarehouse,
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.put(params);
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getAllStockForProduct(PK: string): ResultAsync<QueryCommandOutput, GenericInternalServerError> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: '#pk= :pk AND begins_with ( #sk, :sk )',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':sk': EntityTypePrefixes.WAREHOUSE,
            },
            ExpressionAttributeNames: {
                '#pk': 'PK',
                '#sk': 'SK',
            },
        };
        return ResultAsync.fromPromise(this.dynamoDocumentClient.query(params), (e) => {
            return new GenericInternalServerError('Failed to fetch from Dynamo', JSON.stringify(e));
        });
    }
}
