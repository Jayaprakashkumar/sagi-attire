import { Theme, useMediaQuery } from "@mui/material";

export enum DisplayMedia {
  Desktop = "Desktop",
  Tablet = "Tablet",
  Mobile = "Mobile",
}

export const useDisplayMedia = (): DisplayMedia => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isMediumScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  if (isSmallScreen) return DisplayMedia.Mobile;
  if (isMediumScreen) return DisplayMedia.Tablet;
  return DisplayMedia.Desktop;
};
