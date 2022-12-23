import { Handler } from 'aws-lambda';

export const handleInput: Handler = (event, context, callback) => {
    callback(null, {
        message: event.message,
        description: event.description,
        handledAgain: true,
    });
};
