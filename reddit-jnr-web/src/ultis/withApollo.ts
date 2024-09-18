import {ApolloClient, InMemoryCache} from "@apollo/client"
import { PaginatedPosts } from "../generated/graphql";
import {withApollo} from "./createWithApollo/index"
import { NextPageContext } from "next";


const createClient = (ctx: NextPageContext) => new ApolloClient({
    uri: "http://localhost:4000/graphql", 
    credentials: "include", 
    headers: {
      cookie: typeof window === "undefined" ? ctx?.req?.headers?.cookie : ""
    }, 
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: { 
              keyArgs:[], 
              merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts{
                return {
                  ...incoming, 
                  posts: [...existing?.posts || [], ...incoming.posts]
                }
              }
            }
          }
        }
      }
    }) 
  })
  

export const  createWithAp = withApollo(createClient)
