/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack } from "@mui/material";
import { ISliders, Slider } from "./Slider";

import CategoryHighlights from "./CategoryHighlights";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";
import { useEffect, useState } from "react";
import CategoryVideoSlider, { ICategories } from "./CategoryVideoSlider";
import NewArrival from "./NewArrival";
import { getLandingPage } from "../../api/landingPage";

export const Home = () => {
  const displayMedia = useDisplayMedia();
  const [slider, setSlider] = useState<ISliders[]>([]);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState("");

  const fetchApi = async () => {
    const response = await getLandingPage();
    if (response) {
      const { categoriesCollection, imageSliderCollection } =
        response.data.landingPageCollection.items[0];
      const sliderData = modifySlider(imageSliderCollection);
      const categoryData = modifyCategoryVideos(categoriesCollection);

      setSlider(sliderData);
      setCategories(categoryData);
      setLoading(false);
    } else {
      setError("Invalid attempt");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchApi();
  }, []);

  return (
    <Stack rowGap={{ xs: 2, md: 3 }}>
      <Box>
        {displayMedia === DisplayMedia.Mobile && <CategoryHighlights />}
        <Slider items={slider} />
      </Box>

      <CategoryVideoSlider
        categories={categories}
        title="Our Categories"
        subTitle="Explore our new trend"
      />
      <NewArrival
        title="New Arrivals"
        subTitle="Discover our latest collection"
      />
    </Stack>
  );
};

const modifySlider = (item: any): ISliders[] => {
  return item.items.map((ele: any) => {
    return {
      media: ele.mediaCollection?.items[0]?.url || "",
      title: ele?.content.json || "",
      catgory: ele.category.id,
    };
  });
};

const modifyCategoryVideos = (item: any): ICategories[] => {
  return item.items.map((ele: any) => {
    return {
      media: ele.content?.url || "",
      title: ele?.title || "",
      category: ele.category.id,
    };
  });
};
