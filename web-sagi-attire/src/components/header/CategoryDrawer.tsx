import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledButton } from "../ui/Button";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CategoryAccordion from "./CategoryAccordion";
import { Link } from "react-router-dom";

const menuItems = [
  {
    name: "Shop by Category",
    list: [
      "Casual Kurta Set",
      "Office Wear",
      "Ethnic Wear",
      "Party Wear",
      "Plus-size Wear",
      "Short Kurti Wear",
      "Co-Orde",
      "jeans",
      "pants",
      "kurta",
    ],
  },
  {
    name: "End of Season Sale",
    list: [],
  },
  {
    name: "Best Seller",
    list: [],
  },
  {
    name: "Shop by Price",
    list: ["Under 599", "Under 799", "Under 999"],
  },
  {
    name: "Shop by Fabric",
    list: ["Cotton Set", "Silk Set"],
  },
];

const CategoryDrawer = ({
  isOpen,
  handleCloseDrawer,
}: {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}) => {
  return (
    <div>
      <Drawer
        variant="temporary"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: "70%", md: "50%", lg: "30%" },
            boxSizing: "border-box",
          },
        }}
        open={isOpen}
        onClose={handleCloseDrawer}
      >
        <Stack height={"100vh"} justifyContent={"space-between"}>
          <Stack>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              boxShadow="0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);"
              px={2}
              py={1}
              marginBottom={2}
            >
              <Link
                to={"/"}
                onClick={handleCloseDrawer}
                style={{ width: "75px", height: "75px" }}
              >
                <img
                  loading="lazy"
                  src="/images/logo.png"
                  alt="LOGO"
                  width={"100%"}
                  height={"100%"}
                  style={{
                    borderRadius: 100,
                  }}
                />
              </Link>
              <IconButton
                sx={{ p: 0 }}
                size="small"
                edge="start"
                aria-label="close"
                onClick={handleCloseDrawer}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <MenuList toggleDrawer={handleCloseDrawer} />
          </Stack>
          <Box display={"flex"} justifyContent={"space-between"} p={2}>
            <StyledButton
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "16px",
                fontSize: "0.78rem",
                textTransform: "capitalize",
                letterSpacing: "0.9px",
              }}
            >
              <FavoriteBorderOutlinedIcon sx={{ mr: 1 }} />
              Wishlist
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              sx={{ borderRadius: "16px" }}
            >
              Login
            </StyledButton>
          </Box>
        </Stack>
      </Drawer>
    </div>
  );
};

export default CategoryDrawer;

const MenuList = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  return menuItems.map((item, index) => (
    <CategoryAccordion
      category={item}
      index={index}
      key={`${item}-${index}`}
      toggleDrawer={toggleDrawer}
    />
  ));
};
