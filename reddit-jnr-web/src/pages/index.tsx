import { withUrqlClient } from "next-urql";
import {NavBar} from "../components/NavBar"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../ultis/createUrqlClient";
import Layout from "../components/Layout";
import NextLink from "next/link"
import { Link } from "@chakra-ui/react";

const Index = () =>  {
  const [{data }] = usePostsQuery({
    variables: {
      limit:1 
    }
  }) 

  return (
  <Layout variant="small">
    <NextLink href="/create-post">
      <Link>Create post</Link>
    </NextLink>
    <br />
    {!data ? <div>Loading...</div> : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
  </Layout>
)};

export default withUrqlClient (createUrqlClient, {ssr:true})(Index)
