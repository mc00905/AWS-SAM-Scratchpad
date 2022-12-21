import { ProductProvider } from '../../../../src/service-layer/providers/ProductProvider';
import { Substitute } from '@fluffy-spoon/substitute';
import { ProductAgent } from '../../../../src/data-layer/data-agents.ts/ProductAgent';
import { NormalisedProduct, Product } from '../../../../src/service-layer/types/Product';
import { EntityTypes } from '../../../../src/service-layer/enums/EntityTypes';
import { EntityTypePrefixes } from '../../../../src/service-layer/enums/EntityTypePrefixes';
import { okAsync } from 'neverthrow';
import { DocumentNotFoundError } from '../../../../src/middleware/ErrorLibrary';

describe('ProductProvider.class', () => {
    const productAgent = Substitute.for<ProductAgent>();
    const productProvider = new ProductProvider(productAgent);

    describe('ProductProvider.createProduct', () => {
        it('Should create a product with a valid entry', async () => {
            const productId = 'abc123';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
            const name = 'Pink Lady Apples';
            const description = 'A delicious red apple';
            const databaseEntry: Product = {
                PK,
                SK: PK,
                Name: name,
                Description: description,
                EntityType: EntityTypes.PRODUCT,
            };
            productAgent.saveProduct(databaseEntry).returns(okAsync(undefined));
            const createdProduct = await productProvider.createProduct(name, description, productId);
            expect(productAgent.received().saveProduct(databaseEntry));
            const formattedProduct: NormalisedProduct = {
                name,
                description,
                productId,
            };
            expect(createdProduct.isOk()).toBe(true);
            if (createdProduct.isOk()) {
                const val = createdProduct.value;
                expect(val).toHaveProperty('name');
                expect(val).toHaveProperty('description');
                expect(val).toHaveProperty('productId');
                expect(val).toStrictEqual(formattedProduct);
            }
        });
    });

    describe('ProductProvider.getProduct', () => {
        it('Should get a product that exists', async () => {
            const productId = 'abc123';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
            const name = 'Pink Lady Apples';
            const description = 'A delicious red apple';
            const databaseProduct: Product = {
                PK,
                SK: PK,
                Name: name,
                Description: description,
                EntityType: EntityTypes.PRODUCT,
            };
            productAgent.getProduct(PK).returns(okAsync({ $metadata: {}, Item: databaseProduct }));
            const fetchedProduct = await productProvider.getProduct(productId);
            expect(productAgent.received().getProduct(PK));
            const formattedProduct: NormalisedProduct = {
                name,
                description,
                productId,
            };
            expect(fetchedProduct.isOk()).toBe(true);
            if (fetchedProduct.isOk()) {
                const val = fetchedProduct.value;
                expect(val).toHaveProperty('name');
                expect(val).toHaveProperty('description');
                expect(val).toHaveProperty('productId');
                expect(val).toStrictEqual(formattedProduct);
            }
        });

        it('Should throw an error on a product that does not exist', async () => {
            const productId = 'notfound';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
            productAgent.getProduct(PK).returns(okAsync({ $metadata: {}, Item: undefined }));
            const fetchedProduct = await productProvider.getProduct(productId);
            expect(productAgent.received().getProduct(PK));
            expect(fetchedProduct.isErr()).toBe(true);
            if (fetchedProduct.isErr()) {
                const err = fetchedProduct.error;
                expect(err).toBeInstanceOf(DocumentNotFoundError);
            }
        });
    });

    describe('ProductProvider.deleteProduct', () => {
        it('Should delete a product that exists', async () => {
            const productId = 'abc123';
            const PK = `${EntityTypePrefixes.PRODUCT}${productId}`;
            productAgent.deleteProduct(PK).returns(okAsync(undefined));
            const req = await productProvider.deleteProduct(productId);
            expect(productAgent.received().getProduct(PK));
            expect(req.isOk()).toBe(true);
            if (req.isOk()) {
                expect(req.value).toBeUndefined();
            }
        });
    });
});
