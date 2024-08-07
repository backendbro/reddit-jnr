import {debugExchange, fetchExchange, cacheExchange } from "urql";
import {Cache, QueryInput} from "@urql/exchange-graphcache"
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";

function betterUpdateQuery <Result, Query> (
  cache: Cache, 
  qi:QueryInput, 
  result:any, 
  fn: (r: Result, q:Query) => Query 
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)   
  }


// const cache = cacheExchange({
//   updates:{
//     Mutation:{
//       logout: (_result, args, cache, info) => {
//         betterUpdateQuery<LogoutMutation,MeQuery>(
//           cache, {query: MeDocument}, 
//           _result, 
//           () => ({me:null})
//         )
//       }, 
//       login: (_result, args, cache, info) => {
//         betterUpdateQuery<LoginMutation, MeQuery>(
//           cache, 
//           {query:MeDocument}, 
//           _result, 
//           (result, query) => {
//             if (result.login.errors) {
//               return query
//             }else{
//               return { 
                
//                 me: {
//                   user: result.login.user
//                 } as MeQuery['me']
                
//               }
//             }
//           }
//         )
//       }, 
//       register: (_result, args, cache, info) => {
//         betterUpdateQuery<RegisterMutation, MeQuery>(
//           cache, 
//           {query: MeDocument}, 
//           _result, 
//           (result, query) => {
//             if (result.register.errors) {
//               return query 
//             }else {
//               return {
//                 me: {
//                   user: result.register.user
//                 } as MeQuery['me']
//               } 
//             }
//           }
//         )
//       }
//     }
//   }
// })

export const createUrqlClient = (ssrExchange:any) => ({
    url: "http://localhost:4000/graphql",
    exchanges: [debugExchange, cacheExchange, fetchExchange, ssrExchange], 
    fetchOptions:{
      credentials:"include" as const 
    }
})

