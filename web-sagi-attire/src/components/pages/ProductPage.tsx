import Grid from "@mui/material/Grid2";
import { useParams } from "react-router";
import { ProductSlide } from "../product/ProductSlide";
import { Product } from "../../types/Product";
import { useCartStore } from "../../store/useCartStore";
import { useEffect, useState } from "react";
import { mapCartItems, mapProduct } from "../common/util";
import client from "../../contentful/contentfulClient";
import ProductDetails from "../product/ProductDetails";

export interface IProductAttribute {
  color: string;
  size: string;
}
const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product>({} as Product);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<IProductAttribute>({
    color: "",
    size: "",
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);

  const { addItem, items, updateQuantity } = useCartStore();

  useEffect(() => {
    fetchProducts(params?.id as string);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params]);

  // Fetch products from Contentful
  const fetchProducts = async (id: string) => {
    setLoading(true);
    try {
      const response = await client.getEntries({
        content_type: "product",
        "fields.id": id,
        limit: 1,
      });

      const selectedProduct = response.items?.length
        ? mapProduct(response.items[0])
        : ({} as Product);


      setProduct(selectedProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
      // setError("Failed to fetch products.");
    }

    setLoading(false);
  };

  const handleAddToCart = () => {
    if ((product.colors && !selectedOptions?.color) || !selectedOptions?.size) {
      setError(true);
      return;
    }

    if (!product.colors && !selectedOptions?.size) {
      setError(true);
      return;
    }

    const existingCart = items.filter((ele) => ele.id === product.id);
    if (existingCart?.length) {
      updateQuantity(product.id, selectedOptions.size, quantity);
    } else {
      const cartItems = mapCartItems(product, selectedOptions, quantity);
      addItem(cartItems);
    }
    setError(false);
  };

  if (loading) {
    return <></>;
  }

  return (
    <Grid container spacing={3} p={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductSlide product={product} type={"order"} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductDetails
          product={product}
          selectedOptions={selectedOptions}
          selectedOptionState={setSelectedOptions}
          addToCart={handleAddToCart}
          totalQuantity={quantity}
          setQuantity={setQuantity}
          error={error}
        />
      </Grid>
    </Grid>
  );
};

export default ProductPage;
