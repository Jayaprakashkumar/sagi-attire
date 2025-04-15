import { FooterSection } from "./FooterSection";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SocialLinks } from "./SocialLinks";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DisplayMedia, useDisplayMedia } from "../media/useDisplayMedia";

const footerLinks = [
  {
    key: "Help",
    items: [
      {
        name: "Contact Us",
        to: "/privacy-policy",
      },
    ],
  },
  {
    key: "Shop",
    items: [
      {
        name: "Shop at sagiattire.com",
        to: "/",
      },
      {
        name: "All Products",
        to: "/",
      },
      {
        name: "Wishlist",
        to: "/cart",
      },
      {
        name: "Cart",
        to: "/cart",
      },
    ],
  },
  {
    key: "About",
    items: [
      {
        name: "Our Story",
        to: "/privacy-policy",
      },
    ],
  },
  {
    key: "Policies",
    items: [
      {
        name: "Privacy Policy",
        to: "/privacy-policy",
      },
      {
        name: "Return & Refund Policy",
        to: "/privacy-policy",
      },
      {
        name: "Shipping Policy",
        to: "/privacy-policy",
      },
      {
        name: "Terms & Conditions",
        to: "/privacy-policy",
      },
    ],
  },
];

const Footer = () => {
  const displayMedia = useDisplayMedia();
  return (
    <Box
      sx={{
        color: "#fff",
        borderTopWidth: "1px",
        borderColor: "#E5E7EB",
        backgroundColor: "primary.main",
        mt: 2,
        px: 2,
        py: 6,
      }}
    >
      {displayMedia === DisplayMedia.Mobile ? (
        <Box>
          {footerLinks.map((section, index) => (
            <Accordion
              key={index}
              sx={{ backgroundColor: "#000", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              >
                <Typography>{section.key}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ "& ul": { margin: 0 } }}>
                <FooterSection links={section.items} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {footerLinks.map((section, index) => (
            <Grid size={{ xs: 12, sm: 4, md: 3 }} key={`footer-${index}`}>
              <FooterSection title={section.key} links={section.items} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        display={"flex"}
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        gap={2}
        mt={2}
        justifyContent={"end"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <SmartphoneOutlinedIcon sx={{ mr: 0.5, fontSize: "16px" }} />
          <Typography variant="body2">8870551905 / 8939262421</Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <EmailIcon sx={{ mr: 0.5, fontSize: "16px" }} />
          <Typography variant="body2">sagiattireteam@gmail.com</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          py: 4,
          mt: 6,
          borderTop: "2px solid #E5E7EB",
        }}
      >
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={2}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Typography fontSize="0.75rem" color="grey.100" letterSpacing={0.8}>
            © {new Date().getFullYear()} SAGI ATTIRE. All rights reserved.
          </Typography>
          <SocialLinks />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
