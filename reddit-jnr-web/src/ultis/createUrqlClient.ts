import {debugExchange, fetchExchange, stringifyVariables } from "urql";
import {Resolver, Cache, QueryInput, cacheExchange} from "@urql/exchange-graphcache"
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { v4 as uuidv4 } from 'uuid';


// function handler() {
//   return uuidv4();
// }


function betterUpdateQuery <Result, Query> (
  cache: Cache, 
  qi:QueryInput, 
  result:any, 
  fn: (r: Result, q:Query) => Query 
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)   
  }

  const cursor  = () : Resolver => {
    return (_parent, fieldArgs, cache, info) => {
      
      console.log(cache)

      const {parentKey: entityKey, fieldName } = info 
      const allFields = cache.inspectFields(entityKey) 
      const fieldInfos = allFields.filter((info) => info.fieldName === fieldName) 
      const size = fieldInfos.length 
      
      if (size == 0) {
        return undefined
      }

    
      const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
      const isItInTheCache = cache.resolve (
        cache.resolve(entityKey, fieldKey) as string, 
        "posts"
      )

      info.partial = !isItInTheCache

      let hasMore = true;
      const results: string[] = [];

      fieldInfos.forEach((fi) => {
        const key = cache.resolve(entityKey, fi.fieldKey) as string;
        const data = cache.resolve(key, 'posts') as string[];
        const _hasMore = cache.resolve(key, 'hasMore') as boolean;

        if (!_hasMore) {
          hasMore = false;
        }

        results.push(...data);
      });


      return  {
        __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
      }  
    }
  } 



const cache = cacheExchange({
  keys:{
    UserResponse: (data) => data.id || null as any,
    PaginatedPosts: () => null,
  }, 
  resolvers:{
    Query: {
      posts: cursor(),  
    }
  }, 
  updates:{
    Mutation:{
      logout: (_result, args, cache, info) => {
        betterUpdateQuery<LogoutMutation,MeQuery>(
          cache, {query: MeDocument}, 
          _result, 
          () => ({me:null})
        )
      }, 
      login: (_result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache, 
          {query:MeDocument}, 
          _result, 
          (result, query) => {
            if (result.login.errors) {
              return query
            }else{
              return { 
                
                me: {
                  user: result.login.user
                } as MeQuery['me']
                
              }
            }
          }
        )
      }, 
      register: (_result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache, 
          {query: MeDocument}, 
          _result, 
          (result, query) => {
            if (result.register.errors) {
              return query 
            }else {
              return {
                me: {
                  user: result.register.user
                } as MeQuery['me']
              } 
            }
          }
        )
      }
    }
  }
})




export const createUrqlClient = (ssrExchange:any) => ({
    url: "http://localhost:4000/graphql",
    exchanges: [debugExchange, cache, ssrExchange, fetchExchange], 
    fetchOptions:{
      credentials:"include" as const 
    }
})



