export type ValueOf<T> = T[keyof T];

export type ProductModel = {
  id: string;
  description: string;
  price: number;
  title: string;
};

export type StockModel = {
  product_id: ProductModel["id"];
  count: number;
};

export type Product = ProductModel & Pick<StockModel, "count">;
