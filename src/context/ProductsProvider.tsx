import { createContext, ReactElement, useState, useEffect } from "react";

export type ProductType = {
  sku: string;
  name: string;
  price: number;
};
const initState: ProductType[] = [];
// const initState: ProductType[] = [
//   {
//     sku: "item0001",
//     name: "Widget",
//     price: 9.99,
//   },
//   {
//     sku: "item0002",
//     name: "Premium Widget",
//     price: 19.99,
//   },
//   {
//     sku: "item0003",
//     name: "Deluxe Widget",
//     price: 29.99,
//   },
// ];

export type UseProductsContextType = { products: ProductType[] };
const initContextState: UseProductsContextType = { products: [] };

const ProductsContext = createContext<UseProductsContextType>(initContextState);
type ChildrenType = { children?: ReactElement | ReactElement[] };

export default ProductsContext;

export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  const [products, setProducts] = useState<ProductType[]>(initState);

  // fetching data of products from the server
  useEffect(
    () => {
      // the return type is Promise<ProductType[]> because the fetch function returns a Promise
      const fetchProducts = async (): Promise<ProductType[]> => {
        const data = await fetch("http://localhost:3500/products")
          .then((res) => {
            return res.json();
          })
          .catch((err) => {
            if (err instanceof Error) alert(err.message);
          });
        return data;
      };

      // fetch products, then set the products state
      fetchProducts().then((products) => setProducts(products));
    },
    // ==== run only once ====
    // "When the values in the dependency array change, the effect will be re-executed"
    // in this case, the effect will run only once because the dependency array is empty
    []
  );

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};
