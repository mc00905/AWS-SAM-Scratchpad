import { ProductProvider } from '../../../../src/service-layer/providers/ProductProvider';
import { Substitute } from '@fluffy-spoon/substitute';
import { ProductAgent } from '../../../../src/data-layer/data-agents.ts/ProductAgent';
import { NormalisedProduct, Product } from '../../../../src/service-layer/types/Product';
import { EntityTypes } from '../../../../src/service-layer/enums/EntityTypes';
import { EntityTypePrefixes } from '../../../../src/service-layer/enums/EntityTypePrefixes';
import { okAsync } from 'neverthrow';

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
            productAgent.saveProduct(databaseEntry).returns(okAsync(databaseEntry));
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
});
