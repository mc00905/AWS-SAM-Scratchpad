import { Handler } from 'aws-lambda';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME || 'BUCKET_NAME';

export const uploadJSONToBucket: Handler = async (event, context) => {
    const bucketParams: PutObjectCommandInput = {
        Bucket: BUCKET_NAME,
        Key: uuidv4(),
        Body: JSON.stringify({
            message: 'Hello World!',
        }),
    };
    await s3Client.send(new PutObjectCommand(bucketParams));
};
