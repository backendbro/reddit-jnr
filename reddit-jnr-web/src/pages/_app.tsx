import { CSSReset, ThemeProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
   
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps}/>
    </ThemeProvider>
  );
}

export default MyApp;


