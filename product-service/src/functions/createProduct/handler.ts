import * as Joi from "joi";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { StatusCode } from "@libs/errors";
import { CreateProductPayload } from "@libs/types";

import { validateCreateProductPayload } from "./validateCreateProductPayload";
import { initProductModel } from "./initProductModel";
import { storeProduct } from "./storeProdcut";

const handler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  try {
    console.log(JSON.stringify(event));

    const createProductPayload = JSON.parse(
      event.body + ""
    ) as CreateProductPayload;

    validateCreateProductPayload(createProductPayload);

    const productWidhId = initProductModel(createProductPayload);

    const persistedProduct = await storeProduct(productWidhId);

    return formatJSONResponse(persistedProduct, event.headers.origin);
  } catch (e) {
    if (e instanceof Joi.ValidationError)
      return formatJSONResponse(
        { message: e.message },
        event.headers.origin,
        StatusCode.BadRequest
      );
  }
};

export const main = middyfy(handler);
