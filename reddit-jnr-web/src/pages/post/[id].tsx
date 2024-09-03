import React from "react" 
import { Box, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout"
import useGetPostFromUrl from "../../ultis/getSinglePost";
import EditPostButtons from "../../components/EditPostButtons";
import { createWithAp } from "../../ultis/withApollo";


const Post: React.FC = ({}) => {
    const {data, error, loading} = useGetPostFromUrl() 

    if (error) {
        return <div>{error.message}</div>
    }

    if (loading) {
        return (
            <Layout>
                <div> Loading... </div>
            </Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box> Could not find post </Box>
            </Layout>
        )
    }

    return (
        <>
            <Layout variant="regular">


                <Stack spacing={8}>
                    <Flex p={5} shadow="md" borderWidth="1px">
                    <Box>
                        <Heading fontSize={25} mt={1} mb={2}> 
                            {data.post.title}
                        </Heading> 

                    <Text mb={3}>{data.post.text}</Text>
                    <EditPostButtons id={data.post.id} creatorId={data.post.creator.id} />
                    </Box>
                    
                </Flex>
                </Stack>
            </Layout>
        </>
    )
}

export default createWithAp({ssr:true})(Post)