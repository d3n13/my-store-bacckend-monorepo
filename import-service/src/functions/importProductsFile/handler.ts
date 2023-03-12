import { formatTextResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { s3Client } from "@libs/s3-client";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

const AWS_S3_BUCKET_NAME = "import-service-csv-starage50830459";
const AWS_SIGNED_KEY_EXPIRES_IN_SEC = 3600;

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<void> = async (
  event
) => {
  const fileName = event.queryStringParameters.name;
  const key = `uploaded/${fileName}`;
  const signedUrl = createPresignedUrlWithClient(key);
  return formatTextResponse(signedUrl, event.headers.origin);
};

function createPresignedUrlWithClient(key: string) {
  return s3Client.getSignedUrl("putObject", {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: AWS_SIGNED_KEY_EXPIRES_IN_SEC,
  });
}

export const main = middyfy(importProductsFile);
