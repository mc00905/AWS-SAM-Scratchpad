import { SNSEvent } from 'aws-lambda';

export const print = (event: SNSEvent) => {
    event.Records.map((record: any) => {
        console.log(record);
    });
};
