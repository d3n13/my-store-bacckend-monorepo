import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { CreateProductPayload } from "@libs/types";
import { main } from "./handler";

const prod: CreateProductPayload = {
  description: "descr",
  price: 2324,
  title: "Title",
};

const event = {
  Records: [
    {
      body: JSON.stringify(prod),
    },
  ],
} as Parameters<typeof main>[0];

beforeAll(() => {
  AWSMock.setSDKInstance(AWS);
});

afterAll(() => {
  AWSMock.restore();
});

describe("catalogBatchProcess", () => {
  it("Should not throw", () => {
    main(event);
  });
});
