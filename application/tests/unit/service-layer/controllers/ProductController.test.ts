import { Substitute } from '@fluffy-spoon/substitute';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { okAsync } from 'neverthrow';
import { ProductController } from '../../../../src/service-layer/controllers/ProductController';
import { ProductProvider } from '../../../../src/service-layer/providers/ProductProvider';

describe('ProductController', () => {
    const provider = Substitute.for<ProductProvider>();
    const controller = new ProductController(provider);

    describe('.createProduct', () => {
        it('Should successfully create a product with a valid payload', async () => {
            const name = 'banana';
            const description = 'description';
            const reqBody = JSON.stringify({ name, description });
            const productId = 'abc123';

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: reqBody,
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/products',
                pathParameters: {},
                queryStringParameters: {},
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/products',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/products',
                    stage: 'development',
                },
                resource: '',
                stageVariables: {},
            };
            const mockedCreateResult = { name, description, productId };
            provider.createProduct(name, description).resolves(okAsync(mockedCreateResult));
            const request = await controller.createProduct(event);
            expect(provider.received().createProduct(name, description));
            expect(request.statusCode).toBe(201);
            expect(request.body).toBeTruthy();
            const body = JSON.parse(request.body);
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
            const data = body.data;
            expect(data).toStrictEqual(mockedCreateResult);
        });
    });
});
