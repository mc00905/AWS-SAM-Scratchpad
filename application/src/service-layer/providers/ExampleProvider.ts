import { errAsync, ResultAsync } from 'neverthrow';
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

    public getDocument(
        key: string,
    ): ResultAsync<Record<string, any>, GenericInternalServerError | DocumentNotFoundError> {
        const data = this.agent.getDoc(key);
        return data
            .map((obj) => {
                if (!obj.Item) {
                    return errAsync(new DocumentNotFoundError('Did not find document'));
                }
                return obj.Item;
            })
            .mapErr((e) => e);
    }
}
