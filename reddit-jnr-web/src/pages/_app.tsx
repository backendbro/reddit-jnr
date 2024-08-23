import { ChakraProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import { cacheExchange, Provider, createClient, debugExchange, fetchExchange, Exchange } from "urql";
import theme from "../theme";
import { AppProps } from "next/app";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <Provider value={client}>
    //   <ChakraProvider theme={theme}>
    //     <Component {...pageProps} />
    //   </ChakraProvider>
    // </Provider> 

    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps}/>
    </ThemeProvider>
  );
}

export default MyApp;


