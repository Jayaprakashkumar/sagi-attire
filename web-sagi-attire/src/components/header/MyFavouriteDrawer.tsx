import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IconButton, Stack, Typography } from "@mui/material";
import { StyledButton } from "../ui/Button";
import { useFavouriteStore } from "../../store/useFavouriteStore";
import { getAmountWithCurrency } from "../common/util";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

const MyFavouriteDrawer = ({
  isOpen,
  handleCloseDrawer,
}: {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}) => {
  const myFavourites = useFavouriteStore((state) => state.items);
  const { removeFav } = useFavouriteStore();

  return (
    <div>
      <Drawer
        variant="temporary"
        anchor="right"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "75%", md: "40%" },
            boxSizing: "border-box",
            padding: 2,
          },
        }}
        open={isOpen}
        onClose={handleCloseDrawer}
      >
        <Stack>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              variant="h4"
              textAlign={"center"}
              fontWeight={700}
              mb={"0.5rem"}
              py={3}
              flexGrow={1}
            >
              My Favourites
            </Typography>
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

          {myFavourites.length ? (
            <Box>
              {myFavourites.map((item, index) => (
                <Stack
                  key={`myFav-${index}`}
                  display={"flex"}
                  justifyContent={"space-between"}
                  flexDirection={"row"}
                  sx={{
                    rowGap: 2,
                    alignItems: "start",
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
                      <Typography
                        variant="inherit"
                        fontWeight={700}
                        mb={"0.5rem"}
                      >
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
                  <StyledButton
                    variant="text"
                    color="info"
                    sx={{
                      padding: "3px 6px",
                      minWidth: "14px",
                    }}
                    onClick={() => removeFav(item.id)}
                  >
                    <Trash2 width={"1rem"} height={"1rem"} />
                  </StyledButton>
                </Stack>
              ))}
            </Box>
          ) : (
            <Stack
              sx={{
                textAlign: "center",
                height: "50vh",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" fontWeight={700} mb={"0.5rem"} pb={2}>
                Your wishlist is empty
              </Typography>
              <Link onClick={handleCloseDrawer} to={"/"}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  Continue Shopping
                </StyledButton>
              </Link>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </div>
  );
};

export default MyFavouriteDrawer;
