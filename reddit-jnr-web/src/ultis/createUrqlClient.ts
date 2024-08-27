import {debugExchange, fetchExchange, stringifyVariables } from "urql";
import {Resolver, Cache, QueryInput, cacheExchange} from "@urql/exchange-graphcache"
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, CreatePostMutation, PostsQuery, VoteMutation, VoteMutationVariables} from "../generated/graphql";
import gql from "graphql-tag"


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
      vote: (_result, args, cache, info) => {
        const {postId, value} = args as VoteMutationVariables;
        
        const data = cache.readFragment(
          gql `
            fragment _ on Post {
              id, 
              points
            }
          `, {id: postId, points: value} 
        )

       
        if (data) {
          const newPoints = data.points + value  
          cache.writeFragment(
            gql`
            fragment _ on Post {
              id,
              points 
            }`, {id: postId, points: newPoints}
          )
        }
      }, 
      createPost: (_result, args, cache, info) => {
        const allFields = cache.inspectFields("Query") 
        const fieldInfos = allFields.filter((info) => info.fieldName === "posts")
        fieldInfos.forEach((fi) => {
          cache.invalidate("Query", "posts", fi.arguments || {})
        })
       },
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



