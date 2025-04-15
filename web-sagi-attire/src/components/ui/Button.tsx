import { Button, ButtonProps } from "@mui/material";

interface StyledButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export const StyledButton = (props: StyledButtonProps) => {
  return (
    <Button
      sx={{
        "&:hover": {
          color: props.variant === "text" ? "secondary.main" : "inherit",
          backgroundColor: props.variant === "text" ? "#fff" : "inherit",
        },
        minWidth: props.variant === "text" ? "24px" : "inherit",
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
};
