import { uuid } from "uuidv4";
import { CreateProductPayload, ProductModel } from "@libs/types";

export const initProductModel = (
  requestedModel: CreateProductPayload
): ProductModel => {
  return { ...requestedModel, id: uuid() };
};
