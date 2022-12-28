import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

export class ProductWarehousePublishers {
    private snsClient: SNSClient;

    constructor(snsClient?: SNSClient) {
        this.snsClient = snsClient || new SNSClient({ region: process.env.AWS_REGION });
    }

    public async publish(message: string, origin: string) {
        const snsPublishParams: PublishCommandInput = {
            TopicArn: process.env.SNS_TOPIC,
            Message: JSON.stringify(message),
            MessageAttributes: {
                origin: {
                    DataType: 'String',
                    StringValue: origin,
                },
            },
        };
        await this.snsClient.send(new PublishCommand(snsPublishParams));
    }
}
