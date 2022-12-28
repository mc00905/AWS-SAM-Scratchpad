import { Handler } from 'aws-lambda';
import {
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const ACCESS_POINT_ARN = process.env.ACCESS_POINT_ARN || 'ACCESS_POINT_ARN';

export const uploadJSONToBucket: Handler = async (event, context) => {
    const key = uuidv4();
    const bucketParams: PutObjectCommandInput = {
        Bucket: ACCESS_POINT_ARN,
        Key: key,
        Body: JSON.stringify({
            message: 'Hello World!',
        }),
    };
    await s3Client.send(new PutObjectCommand(bucketParams));
    const getFromBucketParams: GetObjectCommandInput = {
        Bucket: ACCESS_POINT_ARN,
        Key: key,
    };
    const obj = await s3Client.send(new GetObjectCommand(getFromBucketParams));
    const body = (await obj.Body?.transformToString()) || undefined;
    return {
        result: body,
    };
};
