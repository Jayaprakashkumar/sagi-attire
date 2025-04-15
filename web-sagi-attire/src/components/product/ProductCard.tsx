import { Product } from "../../types/Product";
import { ProductCaption } from "./ProductCaption";
import ProductLink from "./ProductLink";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <>
      <ProductLink product={product} />
      <ProductCaption product={product} />
    </>
  );
};

export default ProductCard;
