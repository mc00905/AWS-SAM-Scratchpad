import { Handler } from 'aws-lambda';

export const handleInput: Handler = async (event, context, callback) => {
    return {
        message: event.message,
        description: event.description,
        handledAgain: true,
    };
};
