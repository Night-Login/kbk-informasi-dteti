import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#255b88",
      dark: "#173f64",
      light: "#dceaf5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e3b23c",
      dark: "#76560c",
      contrastText: "#172c40",
    },
    background: {
      default: "#f5f7f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#172c40",
      secondary: "#526576",
    },
    error: {
      main: "#b42318",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "var(--font-public-sans), Arial, sans-serif",
    h4: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #d5dde4",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#173f64",
          backgroundColor: "#edf3f7",
        },
      },
    },
  },
});
