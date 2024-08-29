import { Box, Button, Link, Flex, Heading } from "@chakra-ui/react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../ultis/createUrqlClient"


interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{data, fetching}] = useMeQuery({})

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
    <Flex alignItems="center">
      <NextLink href="/create-post">
        
        <Button as={Link}>
          create post
        </Button>
        
      </NextLink>

        <Box ml={3} mr={3}>{data?.me?.user?.username} </Box> 
        <Button variant={"link"} isLoading={logoutFectching} onClick = {
          handleLogout
        }> logout </Button>
    </Flex>
  } 

    return (
    <Flex bg="tan" p={4} position="sticky" top={0} zIndex={1} alignItems="center">
      <Flex flex={1} align="center" maxW={800} margin="auto">
        <NextLink href="/"> 
          <Link>
            <Heading> LiReddit </Heading>
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
export default withUrqlClient(createUrqlClient, {ssr:true}) ( NavBar )
