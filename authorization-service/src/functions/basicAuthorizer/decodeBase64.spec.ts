import { encodeBase64, decodeBase64 } from "./base64-utils";

const cases = ["123", "321", "Oh hi world"];

describe("base64-utils", () => {
  cases.forEach((input) => {
    it(`Should encode and decode back ${input}`, () => {
      const base64 = encodeBase64(input);
      expect(base64).not.toBe(input);
      const result = decodeBase64(base64);
      expect(result).toBe(input);
    });
  });
});
