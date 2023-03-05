import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";
import { ValueOf } from "@libs/types";

const awsFunction: ValueOf<AWS["functions"]> = {
  handler: `${handlerPath(__dirname)}/handler.main`,

  events: [
    {
      http: {
        method: "get",
        path: "/products",
        cors: true,
      },
    },
  ],
};

export default awsFunction;
