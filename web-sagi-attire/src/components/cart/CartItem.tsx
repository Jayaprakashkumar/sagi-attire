import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "../../types/Product";
import { useCartStore } from "../../store/useCartStore";
import { StyledButton } from "../ui/Button";
import { Stack, Box, Typography } from "@mui/material";
import { getAmountWithCurrency } from "../common/util";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <Stack
      display={"flex"}
      justifyContent={"space-between"}
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        rowGap: 2,
        alignItems: { xs: "start", sm: "center" },
        py: 3,
        borderBottom: "1px solid",
        borderColor: "info.light",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          img: {
            objectFit: "contain",
          },
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          width={"100px"}
          height={"100px"}
          loading="lazy"
        />
        <Box>
          <Typography variant="h5" fontWeight={400} mb={"1rem"}>
            {item.name}
          </Typography>
          <Typography variant="inherit" fontWeight={700} mb={"0.5rem"}>
            {getAmountWithCurrency(item.price)}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            mb={"1rem"}
            color="grey.50"
          >
            {item.color ? `${item.color}/ ` : ""}
            {item.size}
          </Typography>
        </Box>
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          <StyledButton
            variant="outlined"
            color="info"
            sx={{
              padding: "3px 6px",
              minWidth: "20px",
            }}
            onClick={() =>
              updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))
            }
          >
            <Minus width={"1rem"} height={"1rem"} />
          </StyledButton>
          <Typography
            variant="inherit"
            minWidth={"20px"}
            fontWeight={300}
            textAlign={"center"}
          >
            {item.quantity}
          </Typography>
          <StyledButton
            variant="outlined"
            color="info"
            sx={{
              padding: "3px 6px",
              minWidth: "20px",
            }}
            onClick={() =>
              updateQuantity(item.id, item.size, item.quantity + 1)
            }
          >
            <Plus width={"1rem"} height={"1rem"} />
          </StyledButton>
        </Box>
        <StyledButton
          variant="text"
          color="info"
          sx={{
            padding: "3px 6px",
            minWidth: "20px",
          }}
          onClick={() => removeItem(item.id)}
        >
          <Trash2 width={"1rem"} height={"1rem"} />
        </StyledButton>
      </Box>
    </Stack>
  );
};
