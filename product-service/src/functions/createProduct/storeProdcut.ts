import { productsStorage } from "@libs/products-storage";
import { ProductModel } from "@libs/types";

export const storeProduct = async (productModel: ProductModel) => {
  const { store } = productsStorage;
  const product = await store(productModel);
  return product;
};
