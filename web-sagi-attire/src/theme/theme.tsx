import { createTheme, ThemeOptions } from "@mui/material";

const breakpoints = createTheme().breakpoints;

export const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#8f2f20",
    },
    warning: {
      main: "#d66562",
    },
    info: {
      main: "#4b5563",
      light: "#e5e7eb",
    },
    grey: {
      50: "#4b5563",
      100: "#a1a3a5",
      200: "#0000004d",
      300: "#bababa4d",
    },
    common: {
      white: "#fff",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    allVariants: {
      fontStyle: "normal",
      fontWeight: "400",
    },
    h1: {
      marginBottom: "1.5rem",
      lineHeight: "4rem",
      letterSpacing: "0.01563rem",
      [breakpoints.up("sm")]: {
        fontSize: "2.875rem",
      },
      [breakpoints.down("sm")]: {
        fontSize: "2.25rem",
      },
    },
    h2: {
      marginBottom: "1rem",
      lineHeight: "4rem",
      letterSpacing: "0.01563rem",
      [breakpoints.up("sm")]: {
        fontSize: "2.25rem",
      },
      [breakpoints.down("sm")]: {
        fontSize: "1.625rem",
      },
    },
    h4: {
      marginBottom: "1rem",
      letterSpacing: "0.01563rem",
      [breakpoints.up("sm")]: {
        fontSize: "1.65rem",
      },
      [breakpoints.down("sm")]: {
        fontSize: "1.3rem",
      },
    },
    h5: {
      marginBottom: "0.5rem",
      fontSize: "1.2rem",
      letterSpacing: "0.000938rem",
    },
    h6: {
      marginBottom: "0.5rem",
      fontSize: "1rem",
      letterSpacing: "0.000938rem",
    },
    body1: {
      fontSize: "0.9em",
      lineHeight: "1.15em",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.9em",
      lineHeight: "1.15em",
      fontWeight: 300,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: "#fff",
          margin: 0,
          padding: 0,
        },
        body: {
          backgroundColor: "#fff",
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100vh",
        },
      },
    },
  },
});
