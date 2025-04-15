import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type FooterSectionProps = {
  title?: string;
  links: ILinks[];
};

interface ILinks {
  name: string;
  to: string;
}

export function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <Box>
      {title && (
        <Typography
          textTransform="uppercase"
          variant="body2"
          lineHeight="1.25rem"
          letterSpacing={0.5}
          fontWeight={700}
        >
          {title}
        </Typography>
      )}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {links.map((link, index) => (
          <li key={index} style={{ marginBottom: 1, lineHeight: 1.6 }}>
            <Link
              to={link.to}
              style={{
                color: "#fff",
                fontWeight: "bold",
                textDecoration: "none",
                lineHeight: "1.25rem",
                fontSize: "0.725rem",
              }}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
}
