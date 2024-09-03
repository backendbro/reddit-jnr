import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, IconButton } from "@chakra-ui/react"
import { useMeQuery, useDeletePostMutation, PostSnippetFragment } from "../generated/graphql"
import NextLink from "next/link"

interface EditPostButtonProps {
    id: number, 
    creatorId: number
}

const EditPostButtons: React.FC <EditPostButtonProps> = ({id, creatorId}) => {
    const {data: MeData} = useMeQuery() 
    const [deletePost] = useDeletePostMutation()
    
    if ( MeData?.me?.user?.id !== creatorId  ) {
        return null 
    }

    return (
        <>
            
                    <Box ml="auto">

                    <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}> 
                      <IconButton  
                        mr={3}
                        icon={<EditIcon />} 
                        aria-label="Edit Post" 
                       />
                    </NextLink>

                    <IconButton  
                      icon={<DeleteIcon />} 
                      aria-label="Delete Post" 
                      onClick={() => {
                        deletePost({ variables: { id }, update: (cache) => {
                          cache.evict({id: "Post:" + id})
                        }})
                      }}/>

                </Box>  
                  
        </>
    )
}

export default EditPostButtons 