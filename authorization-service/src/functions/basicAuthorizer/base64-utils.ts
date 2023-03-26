export function decodeBase64(base64: Parameters<typeof Buffer.from>[0]) {
  return Buffer.from(base64, "base64").toString();
}

export function encodeBase64(...params: Parameters<typeof Buffer.from>) {
  return Buffer.from(...params).toString("base64");
}
