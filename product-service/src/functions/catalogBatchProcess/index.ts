import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";
import { ValueOf } from "@libs/types";

const awsFunction: ValueOf<AWS["functions"]> = {
  handler: `${handlerPath(__dirname)}/handler.main`,

  events: [
    {
      sqs: {
        arn: "arn:aws:sqs:eu-west-2:627706419469:catalogItemsQueue",
        batchSize: 5,
      },
    },
  ],
};

export default awsFunction;
