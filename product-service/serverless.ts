import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dynamodb-seed"],
  provider: {
    name: "aws",
    region: "eu-west-2",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  functions: { getProductsList, getProductsById },
  package: { individually: true },
  resources: {
    Resources: {
      productsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "products",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      stocksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "stocks",
          AttributeDefinitions: [
            {
              AttributeName: "product_id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "product_id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    seed: {
      seedProducts: {
        table: "products",
        sources: ["./db-seeds/products.json"],
      },
      seedStocks: {
        table: "stocks",
        sources: ["./db-seeds/stocks.json"],
      },
    },
  },
};

module.exports = serverlessConfiguration;
