import { err, errAsync, okAsync, ResultAsync } from 'neverthrow';
import { ExampleAgent } from '../../data-layer/data-agents.ts/ExampleAgent';
import { DocumentNotFoundError, GenericInternalServerError } from '../../middleware/ErrorLibrary';

export class ExampleProvider {
    private agent: ExampleAgent;

    constructor(agent?: ExampleAgent) {
        this.agent = agent || new ExampleAgent();
    }

    public createDocument(str = 'random'): ResultAsync<void, GenericInternalServerError> {
        return this.agent.saveDoc(str);
    }

    public async getDocument(
        key: string,
    ): Promise<ResultAsync<any, DocumentNotFoundError | GenericInternalServerError>> {
        const req = await this.agent.getDoc(key);
        if (req.isOk()) {
            const value = req.value;
            if (!value.Item) {
                return errAsync(new DocumentNotFoundError('Document Not Found', `Document with key: ${key} not found`));
            }
            return okAsync(value.Item);
        } else {
            return errAsync(req.error);
        }
    }
}
