import { Box, Link, Flex } from "@chakra-ui/react"

interface NavBarProps {} 

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    return (
        <Flex bg="tomato" p={4}>
            <Box ml={"auto"}>
            <Link mr={2} href="/login"> login </Link>
            <Link>register</Link> 
            </Box>
        </Flex>

      
    )
}

export default NavBar