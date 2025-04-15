import { Box, Card } from "@mui/material";
import { ProductSlide } from "./ProductSlide";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/Product";

const ProductLink = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  return (
    <Box onClick={() => navigate(`/product/${product.productId}`)}>
      <Card>
        <ProductSlide product={product} />
      </Card>
    </Box>
  );
};

export default ProductLink;
