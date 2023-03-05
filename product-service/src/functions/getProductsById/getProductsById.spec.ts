import { NotFoundError } from "@libs/errors";
import { getProductsById } from "./getProductsById";

describe("getProductsById", () => {
  it("Works with id=1", async () => {
    const foundProduct = await getProductsById(1);
    expect(foundProduct).toBeTruthy();
  });

  it("Throws NotFound with an error message with id=-1", async () => {
    const errorName = "NotFoundError";
    const errorMessage = "Product with id=-1 was not found";

    await expect(getProductsById(-1)).rejects.toMatchObject({
      name: errorName,
      message: errorMessage,
    });

    try {
      await getProductsById(-1);

      // Expect this to never be executed due to thrown NotFoundError
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof NotFoundError).toBe(true);
      expect(e.name).toBe(errorName);
      expect(e.message).toBe(errorMessage);
    }
  });
});
