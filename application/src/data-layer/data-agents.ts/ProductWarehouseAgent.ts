import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    PutCommandInput,
    QueryCommandOutput,
    QueryCommand,
    QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { ResultAsync } from 'neverthrow';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';
import { EntityTypePrefixes } from '../../service-layer/enums/EntityTypePrefixes';
import { ProductWarehouse } from '../../service-layer/types/ProductWarehouse';

export class ProductWarehouseAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocumentClient;
    private snsClient: SNSClient;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocumentClient, snsClient?: SNSClient) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.AWS_REGION });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocumentClient.from(this.dynamoClient);
        this.snsClient = snsClient || new SNSClient({ region: process.env.AWS_REGION });
    }

    public addStockOfProductToWarehouse(
        productWarehouse: ProductWarehouse,
    ): ResultAsync<void, GenericInternalServerError> {
        const params: PutCommandInput = {
            TableName: process.env.TABLE_NAME,
            Item: productWarehouse,
        };
        const snsPublishParams: PublishCommandInput = {
            TopicArn: process.env.SNS_TOPIC,
            Message: 'Hello World!',
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.snsClient.send(new PublishCommand(snsPublishParams));
                await this.dynamoDocumentClient.send(new PutCommand(params));
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getAllStockForProduct(PK: string): ResultAsync<QueryCommandOutput, GenericInternalServerError> {
        const params: QueryCommandInput = {
            TableName: process.env.TABLE_NAME,
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
        return ResultAsync.fromPromise(
            (async () => {
                const data = await this.dynamoDocumentClient.send(new QueryCommand(params));
                return data;
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to fetch from Dynamo', JSON.stringify(e));
            },
        );
    }
}
