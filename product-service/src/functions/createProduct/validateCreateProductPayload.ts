import { createProductPayloadSchema } from "@libs/joi-schemas";
import { ProductModel } from "@libs/types";

export function validateCreateProductPayload(
  payload: Omit<ProductModel, "id">
) {
  const { error } = createProductPayloadSchema.validate(payload);

  if (error) {
    throw error;
  }
}
