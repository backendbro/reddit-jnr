import React from "react" 
import { createUrqlClient } from "../../ultis/createUrqlClient"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { Box, Heading, Link, Stack, Text, Flex, Button, Icon, IconButton } from "@chakra-ui/react";
import Layout from "../../components/Layout"
import { usePostQuery } from "../../generated/graphql";

// interface Props {
//     post: PostQuery["post"]
// } 

const Post: React.FC = ({}) => {
    const router = useRouter()
    const {id} = router.query
    
    const intId = typeof id === "string" ? parseInt(id) : -1 

    const [{data, error, fetching}] = usePostQuery({
        pause: intId == -1, 
        variables : {
            id: intId 
        }
    })

    if (error) {
        return <div>{error.message}</div>
    }

    if (fetching) {
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

                    <Text>{data.post.text}</Text>
                    </Box>
                    
                </Flex>
                </Stack>
            </Layout>
        </>
    )
}

export default withUrqlClient(createUrqlClient, {ssr:true})(Post) 

