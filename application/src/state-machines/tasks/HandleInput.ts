import { Handler } from 'aws-lambda';

export const handleInput: Handler = (event, context, callback) => {
    callback(null, {
        handled: true,
    });
};
