import {debugExchange, fetchExchange } from "urql";
import {Resolver, Cache, QueryInput, cacheExchange} from "@urql/exchange-graphcache"
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";

function betterUpdateQuery <Result, Query> (
  cache: Cache, 
  qi:QueryInput, 
  result:any, 
  fn: (r: Result, q:Query) => Query 
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)   
  }

  const cursorPagination  = () : Resolver => {
    return (_parent, fieldArgs, cache, info) => {
      
      const {parentKey: entityKey, fieldName } = info 
      const allFields = cache.inspectFields(entityKey) 
      const fieldInfos = allFields.filter((info) => info.fieldName === fieldName) 
      const size = fieldInfos.length 
      
      if (size == 0) {
        return undefined
      }

      console.log(entityKey)
      
      
      const results: string[] = [] 
      fieldInfos.forEach(fi => {
        const key = cache.resolve(entityKey, fi.fieldKey) as string; 
       

        const data = cache.resolve(key, 'posts') as string[];
        
        
        let _hasMore = cache.resolve(key, 'hasMore');
       

        if (!_hasMore){
           _hasMore = _hasMore as boolean;
          
        }

        results.push(...data);
      })

      return results  
    }
  } 



const cache = cacheExchange({
  keys:{
    UserResponse: (data) => data.id || null as any  
  }, 
  resolver:{
    Query: {
      posts: cursorPagination() 
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

