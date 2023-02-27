import { getProductsList } from "./getProductsList";

describe("getProductsList", () => {
  it("Returns an array", async () => {
    const products = await getProductsList();
    expect(Array.isArray(products)).toBe(true);
  });
});
