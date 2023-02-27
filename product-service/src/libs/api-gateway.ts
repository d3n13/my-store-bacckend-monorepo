import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const ALLOWED_ORIGINS_MAP = {
  "https://d1hip2isccotrp.cloudfront.net": true,
  "http://localhost:3000": true,
};
function isAllowedOrigin(origin: string) {
  return !!ALLOWED_ORIGINS_MAP[origin];
}
function isNotAllowedOrigin(origin: string) {
  return !isAllowedOrigin(origin);
}

function getCORSHeaders(origin: string) {
  if (isNotAllowedOrigin(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": true,
  };
}

export function formatJSONResponse(
  response: unknown,
  origin: string,
  statusCode = 200
) {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: getCORSHeaders(origin),
  };
}
