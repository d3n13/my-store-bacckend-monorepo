import parseCsv from "csv-parser";
import { s3Client } from "@libs/s3-client";
import { sqsClient } from "@libs/sqsClient";

const AWS_S3_BUCKET_NAME = "import-service-csv-starage50830459";
const AWS_SQS_CATALOG_ITEMS_QUEUE_URL =
  "https://sqs.eu-west-2.amazonaws.com/627706419469/catalogItemsQueue";

type S3ObjectRecord = {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
  };
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
  };
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      sequencer: string;
    };
  };
};

const importFileParser = async (event: { Records: S3ObjectRecord[] }) => {
  console.log(JSON.stringify(event));

  const { Records } = event;

  await Promise.all(
    Records.map(
      ({ s3: { bucket, object } }) =>
        new Promise<void>((resolve, reject) =>
          s3Client
            .getObject({
              Bucket: bucket.name,
              Key: object.key,
            })
            .createReadStream()
            .pipe(parseCsv())
            .on("error", (error) => {
              console.error(JSON.stringify(error));
              reject(error);
            })
            .on("data", (data) => {
              const messageBody = JSON.stringify(data);

              return sqsClient
                .sendMessage({
                  MessageBody: messageBody,
                  QueueUrl: AWS_SQS_CATALOG_ITEMS_QUEUE_URL,
                })
                .promise();
            })
            .on("end", async () => {
              const destinationKey = object.key
                .replace("uploaded/", "parsed/")
                .split("/")
                .map((part) =>
                  part.endsWith(".csv")
                    ? Date.now() + "_" + part // Support files with the same name
                    : part
                )
                .join("/");

              await s3Client
                .copyObject({
                  CopySource: `${bucket.name}/${object.key}`,
                  Bucket: bucket.name,
                  Key: destinationKey,
                })
                .promise()
                .then(() => {
                  console.log(`Copied to ${destinationKey}`);
                });

              await s3Client
                .deleteObject({
                  Bucket: AWS_S3_BUCKET_NAME,
                  Key: object.key,
                })
                .promise()
                .then(() => {
                  console.log(`Deleted ${object.key}`);
                });

              resolve();
            })
        )
    )
  );
};

export const main = importFileParser;
