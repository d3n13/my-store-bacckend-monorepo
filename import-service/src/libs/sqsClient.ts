import SQS from "aws-sdk/clients/sqs";

export const sqsClient = new SQS({ apiVersion: "2012-11-05" });
