import { withUrqlClient } from "next-urql";
import {NavBar} from "../components/NavBar"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../ultis/createUrqlClient";

const Index = () =>  {
  const [{data }] = usePostsQuery() 

  return (
  <>
  <NavBar/>
  {
    !data ? <div>Loading...</div> : data.posts.map((p) => <div key={p.id}>{p.title}</div>)
  }
  </>
)};

export default withUrqlClient (createUrqlClient, {ssr:true})(Index)
