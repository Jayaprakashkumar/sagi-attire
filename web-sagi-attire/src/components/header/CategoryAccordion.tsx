import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { getCategoryLink } from "../common/util";

interface ICategory {
  name: string;
  list: string[];
}

export default function CategoryAccordion({
  category,
  index,
  toggleDrawer,
}: {
  category: ICategory;
  index: number;
  toggleDrawer: () => void;
}) {
  return (
    <Stack
      sx={{
        a: {
          textDecoration: "none",
          color: "primary.main",
          textTransform: "capitalize",
        },
        "& #headerLink": {
          fontSize: "1.25rem",
        },
        span: {
          margin: 0,
        },
        rowGap: 2,
      }}
    >
      {!category.list.length ? (
        <Box
          p={2}
          sx={{
            "& a": {
              textTransform: "uppercase",
              fontSize: "15px !important",
              color: "grey.50",
              letterspacing: "2px",
            },
          }}
        >
          <Link
            id="headerLink"
            to={getCategoryLink(category.name)}
            onClick={toggleDrawer}
          >
            {category.name}
          </Link>
        </Box>
      ) : (
        <Accordion
          defaultExpanded={index === 1 ? true : false}
          sx={{ boxShadow: "none" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={`panel1-header-${index}`}
          >
            <Typography
              component="h4"
              sx={{
                fontSize: "15px",
                textTransform: "uppercase",
                color: "grey.50",
                letterspacing: "2px",
              }}
            >
              {category.name}
            </Typography>
          </AccordionSummary>
          {category.list.map((subCategory, subIdx) => (
            <AccordionDetails
              key={`${subCategory}-${subIdx}`}
              sx={{
                paddingLeft: "48px !important",
                paddingTop: 2,
                "&:hover": {
                  backgroundColor: "grey.300",
                },
                "& a": {
                  fontSize: "1rem",
                  "&:hover": {
                    cursor: "pointer",
                  },
                },
              }}
            >
              <Link to={getCategoryLink(subCategory)} onClick={toggleDrawer}>
                {subCategory}
              </Link>
            </AccordionDetails>
          ))}
        </Accordion>
      )}
    </Stack>
  );
}
