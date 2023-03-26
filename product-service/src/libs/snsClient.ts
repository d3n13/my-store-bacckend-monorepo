import SNS from "aws-sdk/clients/sns";

export const snsClient = new SNS({ apiVersion: "2012-11-05" });
