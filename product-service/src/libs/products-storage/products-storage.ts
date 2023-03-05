import { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } from "@libs/env";
import { Product, ProductModel, StockModel } from "@libs/types";
import { flatten } from "@libs/utils";
import { DynamoDB } from "aws-sdk";

import { NotFoundError } from "../errors";
import { mockedData } from "./mocked-data";

const documentClient = new DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

async function getAll(): Promise<Product[]> {
  const [itemsWithNoCount = [], stocks = []] = await Promise.all([
    documentClient
      .scan({ TableName: PRODUCTS_TABLE_NAME })
      .promise()
      .then(({ Items }) => Items as ProductModel[]),
    documentClient
      .scan({ TableName: STOCKS_TABLE_NAME })
      .promise()
      .then(({ Items }) => Items as StockModel[]),
  ]);

  const productIdToCountMap: Record<string, number> = flatten<
    StockModel,
    number
  >(stocks, "product_id", ({ count }) => count);

  const products: Product[] = itemsWithNoCount.map((item: ProductModel) => ({
    ...item,
    count: productIdToCountMap[item.id],
  }));

  return products;
}

function getById(productId: number) {
  const item = mockedData.find(({ id }) => productId === id);

  if (!item) {
    throw new NotFoundError(`Product with id=${productId} was not found`);
  }

  return Promise.resolve(item);
}

export const productsStorage = {
  getAll,
  getById,
};
