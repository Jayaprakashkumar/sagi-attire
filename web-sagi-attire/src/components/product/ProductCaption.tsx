import { Box, Typography } from "@mui/material";
import { getAmountWithCurrency, getOfferPrice } from "../common/util";
import { StyledButton } from "../ui/Button";
import { StrikeThrough } from "../common/comonBlocks";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Product } from "../../types/Product";

export const ProductCaption = ({ product }: { product: Product }) => {
  return (
    <Box
      gap={3}
      sx={{
        width: "100%",
        mt: 2,
      }}
    >
      <Typography
        variant="h6"
        flexGrow={1}
        fontSize={"0.8rem"}
        fontWeight={600}
      >
        {product.name}
      </Typography>
      <ProductPrice offer={product.offer} price={product.price} />
    </Box>
  );
};

export const ProductPrice = ({
  offer,
  price,
}: {
  offer: number;
  price: number;
}) => {
  return (
    <Box display="flex" justifyContent={"space-between"} alignItems={"start"}>
      <Typography variant="h6" fontSize={"0.9rem"}>
        {offer ? (
          <span>
            <StrikeThrough>{getAmountWithCurrency(price)}</StrikeThrough>
            <span
              style={{
                fontWeight: 700,
              }}
            >
              {getAmountWithCurrency(getOfferPrice(offer, price))}
            </span>
          </span>
        ) : (
          getAmountWithCurrency(price)
        )}
      </Typography>
    </Box>
  );
};

export const AddToCart = ({
  addToCart,
  isError = true,
}: {
  addToCart: () => void;
  isError?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 4,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={addToCart}
          sx={{ mb: 1 }}
          fullWidth
        >
          <ShoppingCartOutlinedIcon sx={{ mr: 1 }} />
          Add to Cart
        </StyledButton>

        {isError && (
          <Typography sx={{ fontSize: "12px" }} color="warning.main">
            Please select the color and size before proceed.
          </Typography>
        )}
      </Box>

      {/* <StyledButton variant="text">
        <Badge color="secondary">
          <FavoriteBorderOutlinedIcon />
        </Badge>
      </StyledButton> */}
    </Box>
  );
};
