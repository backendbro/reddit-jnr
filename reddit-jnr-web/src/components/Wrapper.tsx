import Box from '@chakra-ui/core/dist/Box';
import React, { ReactElement, ReactNode } from 'react'
//import {Box} from "@chakra-ui/core"

interface WrapperProps {
    children: ReactElement,
    variant?:"small" | "regular"
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant="regular"}) => {
        return (
            <Box maxW={variant === 'regular' ? "800px" : "400px"} w="100%" mt={8} mx="auto">
                {children}
            </Box>
        );
}

export default Wrapper