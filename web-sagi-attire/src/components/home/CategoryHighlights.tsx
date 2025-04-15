import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategoryLink } from "../common/util";

interface Categories {
  id: string;
  name: string;
  image: string;
}

const categories: Categories[] = [
  {
    id: "w100015",
    name: "jens",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "pants",
    image:
      "https://images.unsplash.com/photo-1666243185223-8380f527a0f6?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "kurta",
    image:
      "https://images.unsplash.com/photo-1664687015197-81bea2227741?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "Casual Kurta Set",
    image:
      "https://images.unsplash.com/photo-1664687015197-81bea2227741?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "Office Wear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "Ethnic Wear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "w100015",
    name: "Party Wear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
  },
];

const StoryBox = ({ image, name }: { image: string; name: string }) => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      onClick={() => navigate(getCategoryLink(name))}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid transparent",
          //   "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",

          background:
            "linear-gradient(45deg,rgb(182, 102, 90), #fa7e1e,rgb(20, 6, 4),rgb(240, 164, 152), #8f2f20)",
          p: "2px",
        }}
      >
        <Avatar
          src={image}
          alt={name}
          sx={{ width: 56, height: 56, border: "2px solid white" }}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{ maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {name}
      </Typography>
    </Box>
  );
};

const CategoryHighlights = () => {
  return (
    <Box
      display="flex"
      gap={2}
      overflow="auto"
      sx={{
        flexDirection: "row",
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        p: 1,
        mt: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
      }}
    >
      {categories.map((item, index) => (
        <StoryBox key={index} image={item.image} name={item.name} />
      ))}
    </Box>
  );
};

export default CategoryHighlights;
