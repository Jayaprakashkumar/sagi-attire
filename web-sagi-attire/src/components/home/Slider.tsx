import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StyledButton } from "../ui/Button";
import { Box, Skeleton } from "@mui/material";
import { Document } from "@contentful/rich-text-types";
import { getCategoryLink } from "../common/util";
import { useNavigate } from "react-router-dom";
import { ItemMarkdown } from "../common/comonBlocks";

export interface ISliders {
  media: string;
  title: Document;
  catgory: string;
}

export const Slider = ({ items }: { items: ISliders[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (items?.length) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [items?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items?.length) {
    return (
      <Box
        position={"relative"}
        display={"flex"}
        justifyContent={"center"}
        boxShadow="0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);"
      >
        <Skeleton
          sx={{ height: { xs: "45vh", md: "65vh" } }}
          animation="wave"
          variant="rectangular"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            width: "50%",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "10m", mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 1 }} />
          <Skeleton
            variant="rounded"
            width={120}
            height={45}
            sx={{ margin: "0 auto" }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      sx={{ height: { xs: "45vh", md: "65vh" , lg:"80vh"} }}
      overflow="hidden"
    >
      {items.map((slide, index) => (
        <Box
          key={`slide-${index}`}
          position={"absolute"}
          sx={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            transform: "translateX(-200%)",
            transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
            transitionDuration: "0.5s",
          }}
          style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
        >
          <Box
            position={"relative"}
            height={"100%"}
            sx={{
              img: {
                objectFit: "cover",
              },
            }}
          >
            <img
              src={slide.media}
              alt={`image-${index}`}
              width={"100%"}
              height={"100%"}
            />
            <Box
              position={"absolute"}
              sx={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: "grey.200",
              }}
            />
            <Box
              sx={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                color: "common.white",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <ItemMarkdown content={slide.title} />
              <StyledButton
                color="primary"
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 600,
                  borderRadius: 1,
                }}
                onClick={() => navigate(getCategoryLink(slide.catgory))}
              >
                Shop Now
              </StyledButton>
            </Box>
          </Box>
        </Box>
      ))}
      <StyledButton
        onClick={prevSlide}
        variant="text"
        sx={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          minWidth: "1.5rem",
          borderRadius: "100px",
          padding: "4px",
          backgroundColor: "#fffc",
          "&:hover": {
            backgroundColor: "#fff",
          },
        }}
      >
        <ChevronLeft height={"1.5rem"} width="1.5rem" />
      </StyledButton>
      <StyledButton
        onClick={nextSlide}
        variant="text"
        sx={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          minWidth: "1.5rem",
          borderRadius: "9999px",
          padding: "4px",
          backgroundColor: "#fffc",
          "&:hover": {
            backgroundColor: "#fff",
          },
        }}
      >
        <ChevronRight height={"1.5rem"} width="1.5rem" />
      </StyledButton>
    </Box>
  );
};
