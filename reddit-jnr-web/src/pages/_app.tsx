import { CSSReset, ThemeProvider } from "@chakra-ui/react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"
import theme from "../theme";
import { AppProps } from "next/app";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", 
  credentials: "include", 
  cache: new InMemoryCache() 
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <Provider value={client}>
    //   <ChakraProvider theme={theme}>
    //     <Component {...pageProps} />
    //   </ChakraProvider>
    // </Provider> 

  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps}/>
    </ThemeProvider>
  </ApolloProvider>
  );
}

export default MyApp;


