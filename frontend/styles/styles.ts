import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#26418f",
      contrastText: "rgb(214, 213, 213)",
    },
    action: {
      disabled: "#26418f",
    },
  },
});

export default theme;
