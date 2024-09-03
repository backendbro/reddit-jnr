import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react" 
import { PostSnippetFragment, useVoteMutation, VoteMutation } from "../generated/types";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
    post: PostSnippetFragment
} 

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
    console.log(value, postId, cache)    
    const data = cache.readFragment <PostSnippetFragment> ({
            id:  "Post:"+postId, 
            fragment: gql`
                fragment _ on Post {
                    id 
                    points 
                    voteStatus
                }
            `
        })

        console.log(data) 

        if (data) {
            if (data.voteStatus === value) {
                return 
            }

            const newPoints = (data.points) + (!data.voteStatus ? 1 : 2) * value 
            
            cache.writeFragment({
                id: "Post:"+postId, 
                fragment: gql`
                fragment _ on Post {
                  id, 
                  points, 
                  voteStatus 
                }`, 
                data: {id:postId, points:newPoints, voteStatus: newPoints}
            })
            
        }
}




const UpdootSection: React.FC <UpdootSectionProps> = ({post}) => {

    const [vote] = useVoteMutation()
    const [loadingState, setLoadingState] = useState <"updoot-loading" | "downdoot-loading" | "not-loading"> ("not-loading")

    return (
        <>
            <Flex direction="column" justifyContent="center" alignItems="center" mr={5}>

            <IconButton icon={<ChevronUpIcon />} aria-label="Up vote" fontSize={25} onClick={() => {
                
                if (post.voteStatus === 1) {
                    return
                }

                setLoadingState("updoot-loading") 
                console.log("Started")
                vote({
                    variables: {
                        value: 1, 
                        postId: post.id 
                    }, 
                    update: (cache) => updateAfterVote(1, post.id, cache)
                    })
                setLoadingState("not-loading")
            } } 
            backgroundColor={post.voteStatus == 1 ? "teal" : undefined}
            isLoading = {loadingState === "updoot-loading"} 
            />
            {post.points}
            
            <IconButton icon={<ChevronDownIcon />} aria-label="Down vote" fontSize={25} 
            onClick={() => {
                if (post.voteStatus === -1) {
                    return
                }
                setLoadingState("downdoot-loading")
                
                vote({
                    variables: {
                        value: -1, 
                        postId: post.id 
                    }, 
                    update: (cache) => updateAfterVote(-1, post.id, cache)
                })

                setLoadingState("not-loading")
            }}
            backgroundColor= {post.voteStatus == -1 ? "tomato": undefined}
            isLoading = {loadingState === "downdoot-loading"} 
            />
            
            </Flex>
        
        </>
    )
}

export default UpdootSection