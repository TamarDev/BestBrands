import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",

  palette: {
    mode: "light",

    primary: {
      main: "#000000",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#FFD000",
      contrastText: "#000000",
    },

    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },

    text: {
      primary: "#111111",
      secondary: "#555555",
    },

    divider: "#e5e5e5",
  },

  typography: {
    fontFamily: "Arial, sans-serif",

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 0,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;