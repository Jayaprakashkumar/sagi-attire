/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import ProductCard from "../product/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";
import { SliderSkeleton, TitleCard } from "./CategoryVideoSlider";
import Grid from "@mui/material/Grid2";
import { getNewArrivals } from "../../api/landingPage";

const NewArrival = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const displayMedia = useDisplayMedia();

  const fetchApi = async () => {
    const response = await getNewArrivals();
    if (response) {
      const { newArrivalCollection } =
        response.data.landingPageCollection.items[0];
      const productData = modifyProducts(newArrivalCollection?.items);

      setProducts(productData);
      setLoading(false);
    } else {
      setError("Invalid Attempt");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (loading) {
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
    <Box
      maxWidth={"xl"}
      sx={{
        width: "100%",
        mx: "auto",
        px: 2,
        "& ul li": {
          marginRight: 2,
        },
      }}
    >
      <TitleCard subTitle={subTitle} title={title} />
      <Carousel
        additionalTransfrom={0}
        arrows={displayMedia == DisplayMedia.Mobile ? false : true}
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        partialVisible
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 3,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
      </Carousel>
    </Box>
  );
};

export default NewArrival;

const modifyProducts = (item: any): Product[] => {
  if (!item?.length) return [] as Product[];
  return item?.map((ele: any) => {
    return {
      id: ele.sys.id as string,
      productId: ele.id,
      name: ele.name,
      description: ele.description,
      price: ele.price,
      offer: ele.offerInPercentage,
      cateogry: ele.category.id,
      images:
        (ele.imagesCollection.items as [])?.map(
          (img: { url: string }) => img.url
        ) || [],
    };
  });
};
