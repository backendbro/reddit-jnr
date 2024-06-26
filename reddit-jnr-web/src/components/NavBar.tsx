import { Box, Button, Link, Flex } from "@chakra-ui/react"
import NextLink from "next/link"
import { useMeQuery } from "../generated/graphql"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{data, fetching}] = useMeQuery()
  
  let body = null 
  
  if (fetching) {
    body = null 
  }else if (!data.me.user) {
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
  }else {
    body = 
    <Flex>
        <Box mr={3}>{data.me?.user?.username} </Box>
        <Button variant={"link"} >logout</Button>
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
