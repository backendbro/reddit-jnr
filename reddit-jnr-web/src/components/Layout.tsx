import React, { ReactElement, ReactNode } from "react";
import Wrapper from "./Wrapper";
import NavBar from "./NavBar";

type WrapperVariant = "small" | "regular"
interface LayoutProps {
    variant?: WrapperVariant, 
    children: ReactNode
}

const Layout: React.FC <LayoutProps> = ({ children, variant }) => {
    return (
       <>
         <NavBar />
         <Wrapper variant={variant} > {children} </Wrapper>
       </>
    )
}

export default Layout