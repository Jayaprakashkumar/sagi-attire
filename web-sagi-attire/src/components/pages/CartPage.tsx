import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { StyledButton } from "../ui/Button";
import { Typography, Container, Box } from "@mui/material";
import { CartItem } from "../cart/CartItem";
import { getAmountWithCurrency } from "../common/util";

export const CartPage: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={"0.5rem"} pb={2}>
          Your cart is empty
        </Typography>
        <Link to="/">
          <StyledButton variant="contained" color="primary" sx={{ mb: 1 }}>
            Continue Shopping
          </StyledButton>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        textAlign={"center"}
        fontWeight={700}
        mb={"0.5rem"}
        py={3}
      >
        Shopping Cart
      </Typography>
      <Box>
        {items.map((item, index) => (
          <CartItem key={`${item.id}-${index}`} item={item} />
        ))}
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} py={3}>
        <Typography variant="h6" fontWeight={700}>
          Total
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          {getAmountWithCurrency(+total.toFixed(2))}
        </Typography>
      </Box>
      {/* <Link to={user ? "/checkout" : "/auth"} state={{ from: "/checkout" }}>
          <Button className="w-full">
            {user ? "Proceed to Checkout" : "Sign in to Checkout"}
          </Button>
        </Link> */}
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </StyledButton>
    </Container>
  );
};
