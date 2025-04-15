import { Box, Skeleton, Typography } from "@mui/material";
import { ItemMarkdown } from "../common/comonBlocks";
import { useEffect, useState } from "react";
import { getPrivacyPolicy } from "../../api/privacyPolicy";

export const PrivayPolicy = () => {
  const [policy, setPolicy] = useState<Document>();
  const [, setError] = useState("");

  const fetchApi = async () => {
    const response = await getPrivacyPolicy();

    if (response) {
      console.log(response);

      const { privacyPolicyCollection } = response.data;
      console.log(privacyPolicyCollection.items[0]?.content.json);

      setPolicy(privacyPolicyCollection.items[0]?.content.json);
    } else {
      setError("Invalid Attempt");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (!policy) {
    return (
      <Box px={3} textAlign={"center"}>
        <Typography variant="h2">Privacy Policy</Typography>
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "10rem" }} />
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", mb: 2, width: "50%" }}
        />
      </Box>
    );
  }

  return (
    <Box px={3}>
      <Typography variant="h2">Privacy Policy</Typography>
      <ItemMarkdown content={policy} />;
    </Box>
  );
};

export default PrivayPolicy;
