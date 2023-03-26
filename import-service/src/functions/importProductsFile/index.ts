import { handlerPath } from "@libs/handler-resolver";
import { ValueOf } from "@libs/types";
import type { AWS } from "@serverless/typescript";

const awsFunction: ValueOf<AWS["functions"]> = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/import",
        cors: true,
        authorizer: {
          arn: "arn:aws:lambda:eu-west-2:627706419469:function:authorization-service-dev-basicAuthorizer",
          type: "token",
          resultTtlInSeconds: 0,
          identityValidationExpression: "^Basic.*$",
        },
        request: {
          parameters: {
            querystrings: {
              name: { required: true },
            },
          },
        },
      },
    },
  ],
};

export default awsFunction;
