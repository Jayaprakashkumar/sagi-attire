import Drawer from "@mui/material/Drawer";
import { Stack, Badge } from "@mui/material";
import { StyledButton } from "../ui/Button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useFavouriteStore } from "../../store/useFavouriteStore";

const MobileDrawer = ({
  isOpen,
  handleMyFavDrawer,
}: {
  isOpen: boolean;
  handleMyFavDrawer: () => void;
}) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const myFavItems = useFavouriteStore((state) => state.items);

  return (
    <div>
      <Drawer
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "100%",
            boxSizing: "border-box",
          },
        }}
        open={isOpen}
        variant="persistent"
        anchor="bottom"
      >
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-around"}
          p={2}
        >
          <StyledButton variant="text" onClick={() => navigate("/")}>
            <HomeOutlinedIcon />
          </StyledButton>
          <StyledButton variant="text">
            <PersonOutlineOutlinedIcon />
          </StyledButton>
          <StyledButton variant="text" onClick={handleMyFavDrawer}>
            <Badge badgeContent={myFavItems.length} color="secondary">
              <FavoriteBorderOutlinedIcon />
            </Badge>
          </StyledButton>
          <StyledButton variant="text" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartItems.length} color="secondary">
              <LocalMallOutlinedIcon />
            </Badge>
          </StyledButton>
        </Stack>
      </Drawer>
    </div>
  );
};

export default MobileDrawer;
