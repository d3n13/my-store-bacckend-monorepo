import { formatTextResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import S3Client from "aws-sdk/clients/s3";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

const AWS_REGION = "eu-west-2";
const AWS_S3_BUCKET_NAME = "import-service-csv-starage50830459";
const AWS_SIGNED_KEY_EXPIRES_IN_SEC = 3600;

const client = new S3Client({ region: AWS_REGION });

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<void> = async (
  event
) => {
  const fileName = event.queryStringParameters.name;
  const key = `uploaded/${fileName}`;
  const signedUrl = createPresignedUrlWithClient(key);
  return formatTextResponse(signedUrl, event.headers.origin);
};

function createPresignedUrlWithClient(key: string) {
  return client.getSignedUrl("putObject", {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: AWS_SIGNED_KEY_EXPIRES_IN_SEC,
  });
}

export const main = middyfy(importProductsFile);
