import React, { useState, useCallback } from "react";
import { StyledButton } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, Typography, Badge, Stack, Skeleton } from "@mui/material";
import { Product } from "../../types/Product";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";
import VideoBlock from "../common/VideoBlock";
import { useFavouriteStore } from "../../store/useFavouriteStore";
import { mapCartItems } from "../common/util";

type IProductType = "view" | "order";

interface ProductSlideProps {
  product: Product;
  type?: IProductType;
  hideFavourites?: boolean;
}

export const ProductSlide = ({
  product,
  type,
  hideFavourites = false,
}: ProductSlideProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFav, setFav] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const displayMedia = useDisplayMedia();
  const { addFav, removeFav, items } = useFavouriteStore();

  const height = type
    ? {
        xs: "300px",
        sm: "500px",
      }
    : "200px";

  const nextSlide = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      setCurrentIndex((prev) => (prev + 1) % product.images?.length);
      e.stopPropagation();
    },
    [product.images?.length]
  );

  const prevSlide = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      setCurrentIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
      e.stopPropagation();
    },
    [product.images.length]
  );

  const handleFavIcon = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => {
      if (isFav) {
        const existingFav = items.filter((ele) => ele.id === id);
        if (existingFav.length) removeFav(id);
      } else {
        const cartItem = mapCartItems(product, null, 0);
        addFav(cartItem);
      }

      setFav((prev) => !prev);
      e.stopPropagation();
    },
    [isFav, items, product, addFav, removeFav]
  );

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Stack rowGap={2}>
      <Box
        position="relative"
        display="flex"
        justifyContent={"center"}
        sx={{
          width: "100%",
          height: height,
          "&:hover": {
            opacity: "0.75",
            cursor: "pointer",
          },
        }}
      >
        <Box
          position={"absolute"}
          sx={{
            inset: 0,
            img: {
              objectFit: "contain",
            },
          }}
        >
          {imageLoading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          )}
          <RenderAsset
            product={product}
            currentIndex={currentIndex}
            onLoad={handleImageLoad}
          />
        </Box>
        <>
          <StyledButton
            onClick={prevSlide}
            variant="text"
            sx={{
              position: "absolute",
              left: "1rem",
              top: "85%",
              minWidth: "0.5rem",
              borderRadius: "100px",
              padding: "2px",
              backgroundColor: "#fffc",
              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <ChevronLeft height={"1rem"} width="1rem" />
          </StyledButton>
          <StyledButton
            onClick={nextSlide}
            variant="text"
            sx={{
              position: "absolute",
              right: "1rem",
              top: "85%",
              minWidth: "0.5rem",
              borderRadius: "100px",
              padding: "2px",
              backgroundColor: "#fffc",
              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <ChevronRight height={"1rem"} width="1rem" />
          </StyledButton>

          {!type && (
            <Box
              sx={{
                position: "absolute",
                bottom: "1.1rem",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 0.5,
              }}
            >
              {product.images?.map((_, index) => (
                <StyledButton
                  key={index}
                  sx={{
                    minWidth: "0.5rem",
                    minHeight: "0.5rem",
                    padding: 0,
                    borderRadius: "100px",
                    backgroundColor:
                      index === currentIndex ? "common.white" : "grey.100",
                  }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </Box>
          )}
        </>

        {!type && product.offer > 0 && (
          <Typography
            variant="body2"
            component="span"
            sx={{
              backgroundColor: "warning.main",
              color: "common.white",
              borderRadius: "100px",
              position: "absolute",
              left: " 2%",
              top: "4%",
              padding: " 9px 4px",
              fontWeight: 600,
              fontSize: "0.7em",
            }}
          >{`-${product.offer}%`}</Typography>
        )}
        {!hideFavourites && (
          <StyledButton
            variant="text"
            onClick={(e) => handleFavIcon(e, product.id)}
            sx={{
              position: "absolute",
              top: "4%",
              right: "2%",
              minWidth: 0,
              p: 0,
            }}
          >
            <Badge color="secondary">
              {isFav ? (
                <FavoriteIcon sx={{ width: "16px" }} color="secondary" />
              ) : (
                <FavoriteBorderOutlinedIcon
                  sx={{ width: "16px" }}
                  color="secondary"
                />
              )}
            </Badge>
          </StyledButton>
        )}
      </Box>
      {type && (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {product.images?.map((item, index) => (
            <StyledButton
              key={index}
              sx={{
                "& img": {
                  objectFit: "contain",
                },
                mr: 1,
                width: "100px",
                height: displayMedia === DisplayMedia.Mobile ? "80px" : "100px",
                padding: 1,
                border: "1.5px solid #e2e2e2",
                boxShadow:
                  index === currentIndex
                    ? "0px 4px 4px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);"
                    : "none",
              }}
              onClick={() => setCurrentIndex(index)}
            >
              {item.includes("//videos") ? (
                <VideoBlock url={item} />
              ) : (
                <img
                  src={item}
                  alt={`Product view ${index + 1}`}
                  width={"100%"}
                  height={"100%"}
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
              )}
            </StyledButton>
          ))}
        </Box>
      )}
    </Stack>
  );
};

interface RenderAssetProps {
  product: Product;
  currentIndex: number;
  onLoad?: () => void;
}

const RenderAsset = ({ product, currentIndex, onLoad }: RenderAssetProps) => {
  return (
    <>
      {product.images[currentIndex].includes("//videos") ? (
        <VideoBlock url={product.images[currentIndex]} />
      ) : (
        <img
          src={product.images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          width={"100%"}
          height={"100%"}
          loading="lazy"
          onLoad={onLoad}
        />
      )}
    </>
  );
};
