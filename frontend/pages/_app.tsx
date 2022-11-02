import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { client } from "../utils/client";
import { Analytics } from "@vercel/analytics/react";

import theme from "../styles/styles";
import { ThemeProvider } from "@mui/material/styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
        <Analytics />
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
