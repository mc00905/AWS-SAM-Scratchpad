import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    GetCommandOutput,
    PutCommand,
    PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ResultAsync } from 'neverthrow';
import { DocumentNotFoundError, GenericInternalServerError } from '../../middleware/ErrorLibrary';

export class ExampleAgent {
    private dynamoClient: DynamoDBClient;
    private dynamoDocumentClient: DynamoDBDocumentClient;

    constructor(dynamoClient?: DynamoDBClient, dynamoDocumentClient?: DynamoDBDocumentClient) {
        this.dynamoClient = dynamoClient || new DynamoDBClient({ region: process.env.Region });
        this.dynamoDocumentClient = dynamoDocumentClient || DynamoDBDocumentClient.from(this.dynamoClient);
    }

    public saveDoc(str = 'random'): ResultAsync<void, GenericInternalServerError | DocumentNotFoundError> {
        const params: PutCommandInput = {
            TableName: process.env.TABLE_NAME,
            Item: {
                PK: 'Primary',
                SK: 'Sort',
                Value: str,
            },
        };
        return ResultAsync.fromPromise(
            (async () => {
                await this.dynamoDocumentClient.send(new PutCommand(params));
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }

    public getDoc(key: string): ResultAsync<GetCommandOutput, GenericInternalServerError> {
        const params: GetCommandInput = {
            TableName: process.env.TABLE_NAME,
            Key: {
                PK: key,
                SK: 'Sort',
            },
        };
        return ResultAsync.fromPromise(
            (async () => {
                const data = await this.dynamoDocumentClient.send(new GetCommand(params));
                return data;
            })(),
            (e) => {
                return new GenericInternalServerError('Failed to create in Dynamo', JSON.stringify(e));
            },
        );
    }
}
