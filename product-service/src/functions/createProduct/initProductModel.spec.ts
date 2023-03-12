import { isUuid } from "uuidv4";
import { initProductModel } from "./initProductModel";

describe("initProductModel", () => {
  it("Should generate a uuid v4", async () => {
    const description = "desc",
      price = 812312,
      title = "Oh hi product";

    const product = initProductModel({
      description,
      price,
      title,
    });

    expect(isUuid(product.id)).toBe(true);

    expect(product.description).toBe(description);
    expect(product.price).toBe(price);
    expect(product.title).toBe(title);
  });
});
