import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import EditPostButtons from "../components/EditPostButtons";
import Layout from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import { PostSnippetFragment, usePostsQuery } from "../generated/graphql";
import { isServer } from "../ultis/isServer";
import { createWithAp } from "../ultis/withApollo";

const Index = () =>  {
  const {data, loading, fetchMore, variables} = usePostsQuery({
    skip:isServer(), 
    variables: {
      limit: 20, 
      cursor: null as null | string
    }, 
    notifyOnNetworkStatusChange: true 
  }) 

  if (!loading && !data){
    
    return <div> no posts </div>
  }

  return (
  <Layout variant="regular">
    

      { loading && !data ? ( <div>Loading...</div> ) :
      
      <Stack spacing={8}>

      {/* { data.posts.map((p) => <div key={p.id}> {p.title} </div> ) } */}
      { data.posts.posts.map((p: PostSnippetFragment) => 

        !p ? null : (
        <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
        
        <UpdootSection post={p}/>
        
        <Box flex={1}>
                <Heading fontSize="xl" mt={4}> 
                  
                  <NextLink href={`/post/${p.id}`} as= {`/post/${p.id}`}>
                    <Link>
                      {p.title} 
                    </Link>
                  </NextLink>
                </Heading>
                <Text mb={3}> Posted by: {p.creator.username}</Text>
                
                <Flex align="center">
                  <Text flex={1}>{p.textSnippet}</Text>
                    <EditPostButtons id={p.id} creatorId={p.creator.id} />
                </Flex>
            </Box>
        </Flex>
        )
        ) }

       </Stack> 
      
      }
    
      {data && data.posts.hasMore ? (
        <Flex> 
          <Button onClick={() => {
            fetchMore ({
              variables: {
                limit: variables?.limit, 
                cursor: (data!.posts.posts[data.posts.posts.length - 1] as PostSnippetFragment).createdAt 
              }
            })
            
          }} isLoading={loading} my={8}  mt={5} mb={5} display="block" mx="auto">load more</Button>
        </Flex>
      ) : null}
  </Layout>
)};

export default createWithAp({ssr:true})(Index)
