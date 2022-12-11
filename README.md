# AWS SAM Scratchpad

Little playground to demonstrate how different AWS Solutions and other technologies can blend together in a minimilistic use case

## OpenAPI Specification API Gateway

Generates an AWS API Gateway API from an OpenAPI Specification file and uses the `x-amazon-apigateway-integration` metadata tags to invoke a lamdbda function.

Requires an IAM Role and nested policy in order to grant invocation rights. This is set via the `credentials` sub-tag.

The `x-amazon-apigateway-request-validator` tags can be used to specify which parts of the request is validated according to the definitions laid out in the specification.