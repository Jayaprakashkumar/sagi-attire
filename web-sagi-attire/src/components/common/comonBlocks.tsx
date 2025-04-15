import { PropsWithChildren } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import { Typography } from "@mui/material";

export const StrikeThrough = ({ children }: PropsWithChildren) => {
  return (
    <span
      style={{
        color: "#0000004d",
        background:
          "linear-gradient(to left top, transparent 47.75%, currentColor 49.5%, currentColor 50.5%, transparent 52.25%)",
        marginRight: "10px",
      }}
    >
      {children}
    </span>
  );
};

export const DescriptionMarkDown = ({
  content,
  expanded,
}: {
  content: Document;
  expanded: boolean;
}) =>
  documentToReactComponents(content, {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {children}
        </Typography>
      ),
    },
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ItemMarkdown = ({ content }: { content: any }) => {
  return documentToReactComponents(content);
};
