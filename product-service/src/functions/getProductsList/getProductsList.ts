import { productsStorage } from "@libs/products-storage";

export const getProductsList = async () => {
  const { getAll } = productsStorage;
  const products = await getAll();
  return products;
};
