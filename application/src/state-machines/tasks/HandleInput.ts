import { Handler } from 'aws-lambda';
import { DocumentNotFoundError } from '../../middleware/ErrorLibrary';

export const handleInput: Handler = async (event, context, callback) => {
    if (event.message === 'throw') throw new DocumentNotFoundError('failed');
    return {
        handled: true,
    };
};
