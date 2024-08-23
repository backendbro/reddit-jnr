import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../ultis/createUrqlClient";
import Layout from "../components/Layout";
import NextLink from "next/link"
import { Box, Heading, Link, Stack, Text, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";

const Index = () =>  {
  const [variables, setVariables] = useState({limit: 40, cursor: null as null | string})
  const [{data, fetching}] = usePostsQuery({
    variables 
  }) 


  
  if (!fetching && !data){
    return <div> no posts </div>
  }

  return (
  <Layout variant="regular">
    <Flex align="center" justifyContent="space-between">
      <Heading> LiReddit </Heading>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
    </Flex>

    <br />

      { fetching && !data ? ( <div>Loading...</div> ) :
      
      <Stack spacing={8}>

      {/* { data.posts.map((p) => <div key={p.id}> {p.title} </div> ) } */}
      { data.posts.posts.map((p) => 
         <Box key={p.id} p={5} shadow="md" borderWidth="1px">  
         <Heading fontSize="xl" mt={4}> {p.title} </Heading>  {p.creator.username} 
         <Text>{p.textSnippet}</Text> 
       </Box>
        ) }

       </Stack> 
      
      }
    
      {data && data.posts.hasMore ? (
        <Flex> 
          <Button onClick={() => {
            setVariables({
              limit: variables.limit, 
              cursor: data!.posts.posts[data.posts.posts.length - 1].createdAt 
            })
          }} isLoading={fetching} my={8}  mt={5} mb={5} display="block" mx="auto">load more</Button>
        </Flex>
      ) : null}
  </Layout>
)};

export default withUrqlClient (createUrqlClient, {ssr:true})(Index)
