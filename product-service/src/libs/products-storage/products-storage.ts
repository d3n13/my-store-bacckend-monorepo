import { NotFoundError } from "../errors";
import { mockedData } from "./mocked-data";

function getAll() {
  return Promise.resolve(mockedData);
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
