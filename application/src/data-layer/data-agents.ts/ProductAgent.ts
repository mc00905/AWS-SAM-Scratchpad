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
import { Product } from '../../service-layer/types/Product';

export class ProductAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocument;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocument) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocument.from(this.dynamoClient);
    }

    public saveProduct(product: Product, tableName?: string): ResultAsync<Product, GenericInternalServerError> {
        const params: PutCommandInput = {
            TableName: tableName ? tableName : process.env.TABLE_NAME,
            Item: product,
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.put(params);
                return product;
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getProduct(PK: string): ResultAsync<GetCommandOutput, GenericInternalServerError> {
        const params: GetCommandInput = {
            TableName: process.env.TABLE_NAME,
            Key: {
                PK,
                SK: PK,
            },
        };
        return ResultAsync.fromPromise(
            (async () => {
                const data = await this.dynamoDocumentClient.get(params);
                return data;
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to fetch from Dynamo', JSON.stringify(e));
            },
        );
    }

    public deleteProduct(PK: string): ResultAsync<void, GenericInternalServerError> {
        const params: DeleteCommandInput = {
            TableName: process.env.TABLE_NAME,
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
