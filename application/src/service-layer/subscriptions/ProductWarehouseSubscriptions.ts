import { SNSEvent } from 'aws-lambda';

export const print = (event: SNSEvent) => {
    event.Records.map((record: any) => {
        const body = JSON.parse(record.body);
        const messageId = record.messageId;
        console.log(`Message with id ${messageId} received`);
        console.log(`Body of message: ${JSON.stringify(body)}`);
    });
};
