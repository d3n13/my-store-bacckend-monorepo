import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { NotFoundError, StatusCode } from "@libs/errors";
import { getProductsById } from "./getProductsById";

export const handler: ValidatedEventAPIGatewayProxyEvent<void> = async (
  event
) => {
  try {
    const productId = parseInt(event.pathParameters.productId);
    const product = await getProductsById(productId);

    return formatJSONResponse(product, event.headers.origin);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return formatJSONResponse(
        { message: e.message },
        event.headers.origin,
        StatusCode.NotFoundError
      );
    }

    return formatJSONResponse(
      { message: e.message },
      event.headers.origin,
      StatusCode.ServerError
    );
  }
};

export const main = middyfy(handler);
