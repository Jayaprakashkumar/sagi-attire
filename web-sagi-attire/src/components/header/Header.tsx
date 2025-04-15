import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Badge,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { StyledButton } from "../ui/Button";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";
import CategoryDrawer from "./CategoryDrawer";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import MobileDrawer from "./MobileDrawer";
import MyFavouriteDrawer from "./MyFavouriteDrawer";
import { useFavouriteStore } from "../../store/useFavouriteStore";
import Banner from "./Banner";
import SearchBar from "../search/SearchBar";

const Header = () => {
  const displayMedia = useDisplayMedia();
  const cartItems = useCartStore((state) => state.items);
  const myFavItems = useFavouriteStore((state) => state.items);
  const [isCategoryOpen, setCategoryDrawer] = useState(false);
  const [isMyFavOpen, setMyFavDrawer] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCategoryDrawer = () => {
    setCategoryDrawer(!isCategoryOpen);
  };

  const toggleMyFavDrawer = () => {
    setMyFavDrawer(!isMyFavOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  return (
    <Box>
      <Banner />
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          marginX: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar sx={{ py: 0.5 }} disableGutters>
            {displayMedia === DisplayMedia.Desktop && (
              <Link to={"/"} style={{ width: "75px", height: "75px" }}>
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
            )}
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ ml: { md: 2 } }}
              onClick={toggleCategoryDrawer}
            >
              <MenuIcon />
            </IconButton>

            <Box
              color="primary.main"
              flexGrow={1}
              fontFamily="system-ui"
              textAlign="center"
              display="flex"
              justifyContent="center"
              m={0}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate("/")}
            >
              <Typography
                variant="h2"
                paddingRight={1.5}
                fontWeight={700}
                letterSpacing={"3px"}
                m={0}
              >
                SAGI
              </Typography>
              <Typography
                variant="h2"
                color="secondary.main"
                fontWeight={700}
                letterSpacing={"3px"}
                m={0}
              >
                ATTIRE
              </Typography>
            </Box>

            <Box>
              <StyledButton variant="text" onClick={toggleSearch}>
                <SearchOutlinedIcon />
              </StyledButton>
              {displayMedia === DisplayMedia.Desktop && (
                <>
                  <StyledButton variant="text">
                    <PersonOutlineOutlinedIcon />
                  </StyledButton>
                  <StyledButton variant="text" onClick={toggleMyFavDrawer}>
                    <Badge badgeContent={myFavItems.length} color="secondary">
                      <FavoriteBorderOutlinedIcon />
                    </Badge>
                  </StyledButton>
                  <StyledButton
                    variant="text"
                    onClick={() => navigate("/cart")}
                  >
                    <Badge badgeContent={cartItems.length} color="secondary">
                      <LocalMallOutlinedIcon />
                    </Badge>
                  </StyledButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {isSearchOpen && <SearchBar onClose={toggleSearch} />}
      <CategoryDrawer
        isOpen={isCategoryOpen}
        handleCloseDrawer={toggleCategoryDrawer}
      />
      <MyFavouriteDrawer
        isOpen={isMyFavOpen}
        handleCloseDrawer={toggleMyFavDrawer}
      />
      <MobileDrawer
        isOpen={displayMedia !== DisplayMedia.Desktop}
        handleMyFavDrawer={toggleMyFavDrawer}
      />
    </Box>
  );
};

export default Header;
