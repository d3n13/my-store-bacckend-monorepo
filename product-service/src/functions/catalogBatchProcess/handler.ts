import { initProductModel } from "@functions/createProduct/initProductModel";
import { productsStorage } from "@libs/products-storage";
import { snsClient } from "@libs/snsClient";
import { CreateProductPayload } from "@libs/types";

const IMPORTED_PRODUCT_TOPIC_ARN =
  "arn:aws:sns:eu-west-2:627706419469:createProductTopic";

type MessageAttributeValue = {
  stringValue: string;
  stringListValues: unknown[];
  binaryListValues: unknown[];
  dataType: string;
};

type MessageAttributesMap = {
  [attribute: string]: MessageAttributeValue;
};

type Record = {
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: {
    ApproximateReceiveCount: string;
    SentTimestamp: string;
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
  };
  messageAttributes: MessageAttributesMap;
  md5OfMessageAttributes: string;
  md5OfBody: string;
  eventSource: string;
  eventSourceARN: string;
  awsRegion: string;
};

type Event = {
  Records: Record[];
};

const handler = async ({ Records }: Event) =>
  Promise.all(
    Records.map(({ body }) =>
      productsStorage
        .store(initProductModel(JSON.parse(body) as CreateProductPayload))
        .then((product) =>
          snsClient
            .publish({
              Message: `Imported ${product.title}: ${product.description}`,
              TopicArn: IMPORTED_PRODUCT_TOPIC_ARN,
            })
            .promise()
        )
    )
  );

export const main = handler;
