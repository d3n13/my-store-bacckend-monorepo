export const mockedData = Array(20)
  .fill("")
  .map((_, index) => {
    const id = index + 1;

    return {
      id,
      name: `Product ${id}`,
      description: `Product Description ${id}`,
      price: 100 + index,
      title: `Product Title ${id}`,
    };
  });
