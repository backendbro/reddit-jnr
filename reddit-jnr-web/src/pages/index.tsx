import {NavBar} from "../components/NavBar"
import { usePostsQuery } from "../generated/graphql";


const Index = () =>  {
  const [{data }] = usePostsQuery()

  return (
  <>
  <NavBar/>

  {
    !data ? <div>Loading...</div> : data.posts.map((p) => <div key={p._id}>{p.title}</div>)
  }
  </>
)};

export default Index;
