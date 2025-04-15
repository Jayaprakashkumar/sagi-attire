import { Stack, Box, keyframes, Typography } from "@mui/material";

const marquee = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const Banner = () => {
  return (
    <Stack
      width={"100%"}
      overflow={"hidden"}
      sx={{ backgroundColor: "secondary.main" }}
    >
      <Box
        sx={{
          animation: `${marquee} 15s linear infinite`,
          display: "flex",
          fontSize: "14px",
          padding: 1,
          color: "common.white",
          gap: 2,
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        <Typography variant="body2" fontWeight={700}>
          test account
        </Typography>
      </Box>
    </Stack>
  );
};

export default Banner;
