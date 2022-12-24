import { Handler } from 'aws-lambda';

export const handleInput: Handler = async (event, context, callback) => {
    return {
        handled: true,
    };
};
