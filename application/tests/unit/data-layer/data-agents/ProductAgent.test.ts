import { Substitute } from '@fluffy-spoon/substitute';
import { ProductAgent } from '../../../../src/data-layer/data-agents.ts/ProductAgent';
import { Product } from '../../../../src/service-layer/types/Product';
import { EntityTypes } from '../../../../src/service-layer/enums/EntityTypes';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, PutCommandInput } from '@aws-sdk/lib-dynamodb';
describe('ProductAgent.class', () => {
    const dynamoClient = Substitute.for<DynamoDBClient>();
    const dynamoDocumentClient = Substitute.for<DynamoDBDocument>();
    const productAgent = new ProductAgent(dynamoClient, dynamoDocumentClient);

    describe('ProductAgent.saveProduct', () => {
        it('Should create a product with a valid entry', async () => {
            const tableName = 'my-fake-table';
            const databaseEntry: Product = {
                PK: 'abc123',
                SK: 'abc123',
                Name: 'Product Name',
                Description: 'My Product Description',
                EntityType: EntityTypes.PRODUCT,
            };
            const mockedPutCommandInput: PutCommandInput = {
                TableName: tableName,
                Item: databaseEntry,
            };
            dynamoDocumentClient.put(mockedPutCommandInput).resolves({ $metadata: {} }); // we do not care about what's returned here
            const savedProduct = await productAgent.saveProduct(databaseEntry, tableName);
            expect(dynamoDocumentClient.received().put(mockedPutCommandInput));
            expect(savedProduct.isOk()).toBe(true);
            if (savedProduct.isOk()) {
                const val = savedProduct.value;
                expect(val).toHaveProperty('PK');
                expect(val).toHaveProperty('SK');
                expect(val).toHaveProperty('Name');
                expect(val).toHaveProperty('Description');
                expect(val).toHaveProperty('EntityType');
                expect(val).toStrictEqual(databaseEntry);
            }
        });
    });
});
