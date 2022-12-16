import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

export class ProductWarehousePublishers {
    private snsClient: SNSClient;

    constructor(snsClient?: SNSClient) {
        this.snsClient = snsClient || new SNSClient({ region: process.env.AWS_REGION });
    }

    public async publish(message: string) {
        const snsPublishParams: PublishCommandInput = {
            TopicArn: process.env.SNS_TOPIC,
            Message: message,
        };
        await this.snsClient.send(new PublishCommand(snsPublishParams));
    }
}
