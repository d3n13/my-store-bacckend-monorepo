import { productsStorage } from "@libs/products-storage";

export const getProductsById = async (productId: string) => {
  const { getById } = productsStorage;

  const product = await getById(productId);

  return product;
};
