import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
  PolicyDocument,
} from "aws-lambda";
import { decodeBase64 } from "./base64-utils";

enum PolicyEffect {
  Allow = "Allow",
  Deny = "Deny",
}

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event
): Promise<APIGatewayAuthorizerResult> => {
  return new Promise<APIGatewayAuthorizerResult>((resolve) =>
    resolve({
      policyDocument: createPolicyDocument(
        getPolicyEffect(event.authorizationToken),
        event.methodArn
      ),
      principalId: "test",
    })
  );
};

function getPolicyEffect(base64Token: string): PolicyEffect {
  return isValidToken(base64Token) ? PolicyEffect.Allow : PolicyEffect.Deny;
}

function isValidToken(base64Token: string) {
  const token = decodeBase64(normalizeToken(base64Token));
  const { login, password } = extractTokenValues(token);

  console.log("isValidToken", { token, base64Token, login, password });

  return login === process.env.USER_NAME && password === process.env.USER_PASS;
}

function normalizeToken(_token: string) {
  const token = _token.replace("Basic ", "");

  if (token.endsWith("==")) {
    return token;
  }

  return token + "==";
}

function extractTokenValues(token: string) {
  const LOGIN_PASSWORD_SPLITTER = ":";
  const [login, password] = token.split(LOGIN_PASSWORD_SPLITTER);
  return { login, password };
}

function createPolicyDocument(
  Effect: PolicyEffect,
  Resource: string
): PolicyDocument {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Resource,
        Effect,
      },
    ],
  };
}

export const main = basicAuthorizer;
