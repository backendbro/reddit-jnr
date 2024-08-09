import { Box, Button, Link, Flex } from "@chakra-ui/react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import { isServer } from "../ultis/isServer"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../ultis/createUrqlClient"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{data, fetching}] = useMeQuery({
    pause:isServer()  
  })

  const [{ fetching:logoutFectching, error }, logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
        await logout({});
       
    } catch (err) {
      
        console.error(err);
    }
  };
  
  let body = null 
  if (fetching) {
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
    <Flex>
        <Box mr={3}>{data?.me?.user?.username} </Box> 
        <Button variant={"link"} isLoading={logoutFectching} onClick = {
          handleLogout
        }> logout </Button>
    </Flex>
  } 

    return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>
        {body}
      </Box>
    </Flex>
  )
}

export default NavBar
//export default withUrqlClient(createUrqlClient, {ssr:true}) ( NavBar )
