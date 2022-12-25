import { Handler } from 'aws-lambda';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { GenericInternalServerError } from '../../middleware/ErrorLibrary';

const sesClient = new SESClient({ region: process.env.AWS_REGION });
const addr = process.env.EMAIL_ADDRESS || 'test@test.com';
const cmd = new SendEmailCommand({
    Destination: {
        CcAddresses: [],
        ToAddresses: [addr],
    },
    Message: {
        Body: {
            Html: {
                Charset: 'UTF-8',
                Data: 'HTML_FORMAT_BODY',
            },
            Text: {
                Charset: 'UTF-8',
                Data: 'My email body',
            },
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Test email',
        },
    },
    Source: addr,
    ReplyToAddresses: [],
});

export const sendEmail: Handler = async (event) => {
    try {
        return await sesClient.send(cmd);
    } catch (e) {
        throw new GenericInternalServerError('Failed to send email', JSON.stringify(e));
    }
};
