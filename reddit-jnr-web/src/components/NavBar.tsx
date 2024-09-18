import { Box, Button, Link, Flex, Heading } from "@chakra-ui/react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import {useRouter} from "next/router"
import { isServer } from "../ultis/isServer"
import { useApolloClient } from "@apollo/client";
import { createWithAp } from "../ultis/withApollo"


export const NavBar: React.FC = ({ }) => {
  
  const router = useRouter() 
  
  const {data, loading} = useMeQuery({
    skip: isServer()  
  })
  
  const [logout, {loading:logoutFectching, error }] = useLogoutMutation();
  const apolloClient = useApolloClient() 

  
  let body = null 
  if (loading) {
    body = null    
  } else if (!data?.me?.user?.username) {
     body = (<> 
        <NextLink href="/login">
          <Link mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link>
            register
          </Link>
        </NextLink>
    </>)
  }
  
  else {
    
    body = 
    <Flex alignItems="center">
      <NextLink href="/create-post">
        
        <Button as={Link}>
          create post
        </Button>
        
      </NextLink>

        <Box ml={3} mr={3}>{data?.me?.user?.username} </Box> 
        <Button variant={"link"} isLoading={logoutFectching} onClick = {

       async () => {
        await logout()
        await apolloClient.resetStore()
       }

        }> logout </Button>
    </Flex>
  } 

    return (
    <Flex bg="tan" p={4} position="sticky" top={0} zIndex={1} alignItems="center">
      <Flex flex={1} align="center" maxW={800} margin="auto">
        <NextLink href="/"> 
          <Link>
            <Heading> Yummy.com </Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>
          {body}
        </Box>
      </Flex>
    </Flex>
  )
}

//export default NavBar
export default  createWithAp({ssr:true})(NavBar)