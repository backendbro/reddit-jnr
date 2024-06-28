import { cacheExchange, debugExchange, fetchExchange, ssrExchange } from "urql";

export const createUrqlClient = () => ({
    url: "http://localhost:4000/graphql",
    exchanges: [debugExchange, cacheExchange, fetchExchange, ssrExchange], 
    fetchOptions:{
      credentials:"include" as const 
    }
})

