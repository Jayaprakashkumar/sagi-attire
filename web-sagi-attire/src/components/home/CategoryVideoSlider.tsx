import { Box, Card, Skeleton, Typography } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import VideoBlock from "../common/VideoBlock";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";
import Grid from "@mui/material/Grid2";
import { useCallback, useMemo } from "react";

export interface ICategories {
  media: string;
  category: string;
  title: string;
}

interface CategoryVideoSliderProps {
  categories?: ICategories[];
  title: string;
  subTitle: string;
}

export const SliderSkeleton = () => {
  const displayMedia = useDisplayMedia();
  const len = useMemo(() => {
    if (displayMedia === DisplayMedia.Mobile) return 2;
    if (displayMedia === DisplayMedia.Tablet) return 4;
    return 3;
  }, [displayMedia]);

  return (
    <>
      {Array(len)
        .fill(true)
        .map((_, index) => (
          <Grid size={{ xs: 6, sm: 3, md: 3, lg: 4 }} key={`skeleton-${index}`}>
            <Skeleton
              sx={{ height: 300 }}
              animation="wave"
              variant="rectangular"
              style={{ marginBottom: 6 }}
            />
            <Skeleton
              animation="wave"
              height={10}
              width="50%"
              style={{ marginBottom: 6 }}
            />
          </Grid>
        ))}
    </>
  );
};

const CategoryVideoSlider = ({
  categories,
  title,
  subTitle,
}: CategoryVideoSliderProps) => {
  const displayMedia = useDisplayMedia();

  const responsive = useMemo(
    () => ({
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        partialVisibilityGutter: 40,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        partialVisibilityGutter: 30,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        partialVisibilityGutter: 30,
      },
    }),
    []
  );

  const renderCategoryCard = useCallback(
    (categoryEle: ICategories, index: number) => (
      <Card
        sx={{
          maxHeight: "400px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          alignItems: "center",
          mr: index === categories?.length ? 0 : 2,
        }}
        key={`category-${index}`}
      >
        <VideoBlock url={categoryEle.media} />
        <Typography
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            color: "#fff",
            backgroundImage: `linear-gradient(transparent, rgba(0, 0, 0, 0.46), rgba(0, 0, 0, 0.8))`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            minHeight: "22%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "end",
            width: "100%",
            paddingBottom: 2,
            m: 0,
          }}
          variant="h6"
          fontWeight={600}
        >
          {categoryEle.title}
        </Typography>
      </Card>
    ),
    [categories?.length]
  );

  if (!categories?.length) {
    return (
      <Grid
        container
        maxWidth={"xl"}
        rowGap={5}
        spacing={3}
        marginTop={3}
        mx={"auto"}
        px={2}
        width={"100%"}
      >
        <TitleCard title={title} subTitle={subTitle} />
        <SliderSkeleton />
      </Grid>
    );
  }

  return (
    <Box sx={{ width: "100%", mx: "auto", px: 2 }} maxWidth={"xl"}>
      <TitleCard title={title} subTitle={subTitle} />
      <Carousel
        additionalTransfrom={0}
        arrows={displayMedia !== DisplayMedia.Mobile}
        autoPlaySpeed={3000}
        centerMode={false}
        containerClass="container"
        draggable
        focusOnSelect={false}
        infinite
        keyBoardControl
        minimumTouchDrag={80}
        partialVisible
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        slidesToSlide={1}
        swipeable
      >
        {categories.map(renderCategoryCard)}
      </Carousel>
    </Box>
  );
};

export default CategoryVideoSlider;

interface TitleCardProps {
  title: string;
  subTitle: string;
}

export const TitleCard = ({ title, subTitle }: TitleCardProps) => {
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} mb={2}>
      <Typography variant="h4" textAlign={"center"} fontWeight={700} my={1}>
        {title}
      </Typography>
      {subTitle && (
        <Typography variant="h6" textAlign={"center"} fontWeight={400} mb={3}>
          {subTitle}
        </Typography>
      )}
    </Box>
  );
};
