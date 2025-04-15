import { Box, Button, Typography } from "@mui/material";

export const Newsletter = () => {
  return (
    <Box>
      <Typography
        textTransform="uppercase"
        variant="body2"
        lineHeight="1.25rem"
        fontSize="0.725rem"
        fontWeight={700}
        letterSpacing={0.5}
        color="grey.100"
        marginBottom="14.4px"
      >
        Join Our Newsletter
      </Typography>
      <Typography
        variant="body2"
        color="grey.100"
        maxWidth={300}
        lineHeight={1.5}
        sx={{ wordWrap: "break-word" }}
      >
        Subscribe to our newsletter to receive updates, news, and exclusive
        offers.
      </Typography>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { mt: 1 },
          display: "flex",
          alignItems: "center",
          gap: 1,
          input: {
            maxWidth: "60%",
            padding: 1,
            "&:focus-visible": {
              outline: "none",
            },
          },
        }}
        noValidate
        autoComplete="off"
      >
        <input type="email" placeholder="Enter your email" />
        <Button
          variant="outlined"
          sx={{
            color: "#fff",
            border: "1px solid #a1a3a5",
            m: 0,
            fontSize: "0.75rem",
            textTransform: "capitalize",
            letterSpacing: 1.1,
          }}
        >
          Subscribe
        </Button>
      </Box>
    </Box>
  );
};
