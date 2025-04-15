import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box } from "@mui/material";

const socialMediaLinks = [
  {
    icon: InstagramIcon,
    to: "https://www.instagram.com/sagi_attire?igsh=cHJpeG1kNGtiajk4",
  },
  {
    icon: FacebookIcon,
    to: "https://www.facebook.com/share/15jfJFHmgY/",
  },
  {
    icon: YouTubeIcon,
    to: "https://youtube.com/@sagiattire?si=Ox7SUJdKePuKMq8Q",
  },
];

const SocialIcon = ({
  Icon,
  href,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
  href?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" color="">
    <Icon />
  </a>
);

export function SocialLinks() {
  return (
    <Box
      display={"flex"}
      gap={1}
      sx={{
        "& a": {
          color: "grey.100",
        },
      }}
    >
      {socialMediaLinks.map((item, index) => (
        <SocialIcon Icon={item.icon} href={item.to} key={`item-${index}`} />
      ))}
    </Box>
  );
}
