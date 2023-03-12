import { s3Client } from "@libs/s3-client";
import parseCsv from "csv-parser";

const AWS_S3_BUCKET_NAME = "import-service-csv-starage50830459";

type S3ObjectRecord = {
  // TODO
  eventVersion: "2.1";
  eventSource: "aws:s3";
  awsRegion: "eu-west-2";
  eventTime: "2023-03-12T21:11:43.635Z";
  eventName: "ObjectCreated:Put";
  userIdentity: {
    principalId: "AWS:AROAZEJRX3EGYYYOO6UOV:import-service-dev-importProductsFile";
  };
  requestParameters: {
    sourceIPAddress: "37.252.94.137";
  };
  responseElements: {
    "x-amz-request-id": "MMDWZ28VQWJTRD8M";
    "x-amz-id-2": "WSTtPL4NVXHYZd4R9BKmeHVzpa8Geb38RMJ58WkjxH5m6YSo5diBQGSJC9dgUoOOuFeuFK/xFsteUknDiaki3Gjj/Z+pITF0mapHMKDolNc=";
  };
  s3: {
    s3SchemaVersion: "1.0";
    configurationId: "import-service-dev-importFileParser-9eceafef0fe575eb52543c9070542d86";
    bucket: {
      name: "import-service-csv-starage50830459";
      ownerIdentity: {
        principalId: "A3E9ICFDWQETVO";
      };
      arn: "arn:aws:s3:::import-service-csv-starage50830459";
    };
    object: {
      key: "uploaded/Untitled%2520spreadsheet%2520-%2520Sheet2.csv";
      size: 1770;
      eTag: "e4bb239bedc2b4a00fe7f76337eb67fe";
      sequencer: "00640E400F9928C7EB";
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
            .on("error", (err) => reject(err))
            .on("data", (data) => console.log(JSON.stringify(data)))
            .on("end", async () => {
              await s3Client
                .copyObject({
                  CopySource: `${bucket.name}/${object.key}`,
                  Bucket: bucket.name,
                  Key: object.key.replace("uploaded/", "parsed/"),
                })
                .promise();

              await s3Client
                .deleteObject({
                  Bucket: AWS_S3_BUCKET_NAME,
                  Key: object.key,
                })
                .promise();

              resolve();
            })
        )
    )
  );
};

export const main = importFileParser;
