import { Handler } from 'aws-lambda';

enum Effect {
    allow = 'Allow',
    deny = 'Deny',
}

const generatePolicy = (principalId: string, effect: Effect, resource: string) => {
    const context = {};
    return {
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Resource: resource,
                    Effect: effect,
                },
            ],
        },
        principalId,
        context,
    };
};
export const authorize: Handler = async (event, context, callback) => {
    const token = event.authorizationToken;
    const methodArn = event.methodArn;
    switch (token) {
        case 'allow':
            return generatePolicy('user', Effect.allow, methodArn);
        case 'deny':
            return generatePolicy('user', Effect.deny, methodArn);
        default:
            callback('Unauthorized');
    }
};
