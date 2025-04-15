import { Chip, Stack, Typography, Box, Badge, Divider } from "@mui/material";
import { SetStateAction, Dispatch, useState } from "react";
import { DescriptionMarkDown, StrikeThrough } from "../common/comonBlocks";
import { AddToCart, ProductPrice } from "./ProductCaption";
import { Product } from "../../types/Product";
import { IProductAttribute } from "../pages/ProductPage";
import { StyledButton } from "../ui/Button";
import { Minus, Plus } from "lucide-react";

const ProductDetails = ({
  product,
  selectedOptions,
  selectedOptionState,
  totalQuantity,
  setQuantity,
  addToCart,
  error,
}: {
  product: Product;
  selectedOptions: IProductAttribute;
  selectedOptionState: Dispatch<SetStateAction<IProductAttribute>>;
  totalQuantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  addToCart: () => void;
  error: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (type: string, value: string) => {
    if (value) {
      selectedOptionState((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const updateQuantity = (val: number) => {
    setQuantity(val);
  };

  return (
    <Stack rowGap={2}>
      <Box>
        <Typography
          variant={"h2"}
          sx={{ fontSize: { md: "2rem" }, mb: 0, lineHeight: "3rem" }}
        >
          {product.name}
        </Typography>
        <Typography variant={"body2"} color="grey.50" fontWeight={400}>
          <Badge>{product.productId}</Badge>
        </Typography>
      </Box>

      {product.colors && (
        <>
          <Typography variant={"h6"} fontWeight={600} m={0}>
            Colors
          </Typography>
          <Stack direction="row" spacing={1}>
            {product.colors?.map((color, index) => (
              <Chip
                key={index}
                label={color}
                variant={
                  selectedOptions?.color === color ? "filled" : "outlined"
                }
                onClick={() => handleSelect("color", color)}
              />
            ))}
          </Stack>
        </>
      )}

      <Typography variant="h6" fontWeight={600} m={0}>
        Size
      </Typography>
      <Stack direction="row" spacing={1}>
        {product.sizes?.map((size, index) => (
          <Chip
            key={index}
            sx={{
              width: "60px",
            }}
            color="info"
            label={
              size.quantity ? (
                size.name
              ) : (
                <StrikeThrough>{size.name}</StrikeThrough>
              )
            }
            disabled={!size.quantity}
            variant={
              selectedOptions?.size === size.name ? "filled" : "outlined"
            }
            onClick={() => handleSelect("size", size.name)}
          />
        ))}
      </Stack>
      <ProductPrice offer={product.offer} price={product.price} />
      <Typography variant="h6" fontWeight={600} m={0}>
        Quantity
      </Typography>
      <Box display={"flex"} alignItems={"center"} gap={2}>
        <StyledButton
          variant="outlined"
          color="info"
          sx={{
            padding: "3px 6px",
            minWidth: "20px",
          }}
          onClick={() => updateQuantity(Math.max(0, totalQuantity - 1))}
        >
          <Minus width={"1rem"} height={"1rem"} />
        </StyledButton>
        <Typography
          variant="inherit"
          minWidth={"20px"}
          fontWeight={300}
          textAlign={"center"}
        >
          {totalQuantity}
        </Typography>
        <StyledButton
          variant="outlined"
          color="info"
          sx={{
            padding: "3px 6px",
            minWidth: "20px",
          }}
          onClick={() => updateQuantity(totalQuantity + 1)}
        >
          <Plus width={"1rem"} height={"1rem"} />
        </StyledButton>
      </Box>
      <Divider />
      <Typography variant="h6" fontWeight={600} m={0}>
        About this item
      </Typography>

      <Box>
        <DescriptionMarkDown
          content={product.description}
          expanded={expanded}
        />
        <Box display={"flex"} justifyContent={"end"} mt={1}>
          <Chip
            label={expanded ? "Read Less" : "Read More"}
            sx={{
              fontSize: "12px",
            }}
            variant="outlined"
            onClick={() => setExpanded(!expanded)}
          />
        </Box>
      </Box>
      <AddToCart addToCart={addToCart} isError={error} />
    </Stack>
  );
};

export default ProductDetails;
