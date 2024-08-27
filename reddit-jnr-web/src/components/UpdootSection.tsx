import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Heading, Link, Stack, Text, Flex, Button, Icon, IconButton } from "@chakra-ui/react";
import React, { useState } from "react" 
import { PostsQuery, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostsQuery["posts"]["posts"][0]
} 
 
const UpdootSection: React.FC <UpdootSectionProps> = ({post}) => {
    const [, vote] = useVoteMutation()
    const [loadingState, setLoadingState] = useState <"updoot-loading" | "downdoot-loading" | "not-loading"> ("not-loading")

    return (
        <>

        
            <Flex direction="column" justifyContent="center" alignItems="center" mr={5}>

            <IconButton icon={<ChevronUpIcon />} aria-label="Up vote" fontSize={25} onClick={() => {
                setLoadingState("updoot-loading") 
                vote({
                        value: 1, 
                        postId: post.id 
                    })
                setLoadingState("not-loading")
            } } 
            isLoading = {loadingState === "updoot-loading"} 
            />
            {post.points}
            
            <IconButton icon={<ChevronDownIcon />} aria-label="Down vote" fontSize={25} 
            onClick={() => {
                setLoadingState("downdoot-loading")
                
                vote({
                    value: -1, 
                    postId: post.id 
                })

                setLoadingState("not-loading")
            }}
            isLoading = {loadingState === "downdoot-loading"} 
            />
            
            </Flex>
        
        </>
    )
}

export default UpdootSection