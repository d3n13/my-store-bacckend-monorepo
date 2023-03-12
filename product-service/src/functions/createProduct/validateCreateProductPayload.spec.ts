import { validateCreateProductPayload } from "./validateCreateProductPayload";

describe("validateCreateProductPayload", () => {
  it("Should not throw if valid", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        price: 123,
        title: "T",
      });
    }).not.toThrow();
  });

  it("Should throw if price is invalid ", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        price: -1,
        title: "T",
      });
    }).toThrow();
  });

  it("Should throw if description is invalid ", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "",
        price: 123,
        title: "T",
      });
    }).toThrow();
  });

  it("Should throw if title is invalid ", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        price: 123,
        title: "",
      });
    }).toThrow();
  });

  it("Should throw if extra fields", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        price: 123,
        title: "",
        someOtherField: 123,
      } as any);
    }).toThrow();
  });

  it("Should throw if missing description", async () => {
    expect(() => {
      validateCreateProductPayload({
        price: 123,
        title: "",
      } as any);
    }).toThrow();
  });

  it("Should throw if missing price", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        title: "",
      } as any);
    }).toThrow();
  });

  it("Should throw if missing title", async () => {
    expect(() => {
      validateCreateProductPayload({
        description: "D",
        price: 123,
      } as any);
    }).toThrow();
  });
});
