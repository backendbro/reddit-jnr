import { ChakraProvider } from "@chakra-ui/react";
import { cacheExchange, Provider, createClient, debugExchange, fetchExchange, Exchange } from "urql";
import theme from "../theme";
import { AppProps } from "next/app";


 
const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [debugExchange, cacheExchange, fetchExchange] , 
  fetchOptions:{
    credentials:"include"
  }
})


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider> 
  );
}

export default MyApp;


