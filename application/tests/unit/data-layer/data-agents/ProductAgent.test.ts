import { Substitute } from '@fluffy-spoon/substitute';
import { ProductAgent } from '../../../../src/data-layer/data-agents.ts/ProductAgent';
import { NormalisedProduct, Product } from '../../../../src/service-layer/types/Product';
import { EntityTypes } from '../../../../src/service-layer/enums/EntityTypes';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommandInput, DynamoDBDocument, GetCommandInput, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { EntityTypePrefixes } from '../../../../src/service-layer/enums/EntityTypePrefixes';

describe('ProductAgent.class', () => {
    const dynamoClient = Substitute.for<DynamoDBClient>();
    const dynamoDocumentClient = Substitute.for<DynamoDBDocument>();
    const tableName = 'my-fake-table';
    const productAgent = new ProductAgent(dynamoClient, dynamoDocumentClient, tableName);

    describe('ProductAgent.saveProduct', () => {
        it('Should create a product with a valid entry', async () => {
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
            const savedProduct = await productAgent.saveProduct(databaseEntry);

            expect(dynamoDocumentClient.received().put(mockedPutCommandInput));
            expect(savedProduct.isOk()).toBe(true);
        });
    });
    describe('ProductAgent.getProduct', () => {
        it('Should fetch a product that exists', async () => {
            const productId = 'abc123';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
            const name = 'My Name';
            const description = 'My Description';
            const mockedGetCommandInput: GetCommandInput = {
                TableName: tableName,
                Key: {
                    PK,
                    SK: PK,
                },
            };
            const databaseProduct: Product = {
                PK,
                SK: PK,
                Name: name,
                Description: description,
                EntityType: EntityTypes.PRODUCT,
            };
            dynamoDocumentClient.get(mockedGetCommandInput).resolves({ $metadata: {}, Item: databaseProduct });
            const savedProduct = await productAgent.getProduct(PK);

            expect(dynamoDocumentClient.received().get(mockedGetCommandInput));
            expect(savedProduct.isOk()).toBe(true);
            if (savedProduct.isOk()) {
                const val = savedProduct.value;
                expect(val).toHaveProperty('Item');
                const item = val.Item;
                if (item) {
                    expect(item).toHaveProperty('PK');
                    expect(item).toHaveProperty('SK');
                    expect(item).toHaveProperty('Name');
                    expect(item).toHaveProperty('Description');
                    expect(item).toHaveProperty('EntityType');
                    expect(item).toStrictEqual(databaseProduct);
                }
            }
        });
        it('Should return undefined when a product does not exist', async () => {
            const productId = '123abc';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;

            const mockedGetCommandInput: GetCommandInput = {
                TableName: tableName,
                Key: {
                    PK,
                    SK: PK,
                },
            };
            dynamoDocumentClient.get(mockedGetCommandInput).resolves({ $metadata: {} });
            const savedProduct = await productAgent.getProduct(PK);

            expect(dynamoDocumentClient.received().get(mockedGetCommandInput));
            expect(savedProduct.isOk()).toBe(true);
            if (savedProduct.isOk()) {
                expect(savedProduct.value.Item).toBe(undefined);
            }
        });
    });

    describe('ProductAgent.deleteProduct', () => {
        it('Should create a product with a valid entry', async () => {
            const productId = '123abc';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;

            const mockedDeleteCommandInput: DeleteCommandInput = {
                TableName: tableName,
                Key: {
                    PK,
                    SK: PK,
                },
            };
            dynamoDocumentClient.delete(mockedDeleteCommandInput).resolves({ $metadata: {} }); // we do not care about what's returned here
            const req = await productAgent.deleteProduct(PK);

            expect(dynamoDocumentClient.received().delete(mockedDeleteCommandInput));
            expect(req.isOk()).toBe(true);
        });
    });
});
