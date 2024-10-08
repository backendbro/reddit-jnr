import { NextPage } from "next";
import {Form, Formik} from "formik"
import Box from '@chakra-ui/core/dist/Box';
import { Link, Flex } from "@chakra-ui/react"
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { Button } from '@chakra-ui/button';
import { RegularUserResponseFragment, useChangePasswordMutation } from "../../generated/graphql"
import { toErrorMap } from '../../ultis/toErrorMap';
import NextLink from "next/link"
import { useRouter } from 'next/router';
import { useState } from "react";
import { transformErrors } from "../../ultis/trasformer";
import { createWithAp } from "../../ultis/withApollo";
import { MeDocument, MeQuery } from "../../generated/types";


const ChangePassword: NextPage<{token:string}> = () => {
    const router = useRouter() 

    const [changePassword] = useChangePasswordMutation() 
    const [tokenError, setTokenError] = useState('') 
      
    return (
        <>
            <Wrapper variant='small'>

                <Formik initialValues={{newPassword:""}} onSubmit={ async (values, {setErrors}) => {
                    const response = await changePassword({ variables: {
                        newPassword: values.newPassword, 
                        token: router.query.token === "string" ? router.query.token : ""  
                        }, 
                        update: (cache, {data}) => {
                            cache.writeQuery<MeQuery> ({ 
                                query: MeDocument, 
                                data: {
                                    __typename: "Query", 
                                    me: {
                                        __typename: "UserResponse", 
                                        user: data.changePassword.user
                                    }
                                }
                            })
                        }
            }) 
                
                    if((response.data?.changePassword as RegularUserResponseFragment).errors) {  

                        const error = (response.data?.changePassword as RegularUserResponseFragment).errors  

                        const errorMap = transformErrors(error)  
                        const toErrorMapV = toErrorMap(errorMap) 
                       

                        if ("token" in toErrorMapV){
                            setTokenError(toErrorMapV.token); 
                        }

                        const sepError = JSON.parse( JSON.stringify(toErrorMapV) ) 
                        
                        if (sepError){
                            setErrors (sepError) 
                        }


                    } else if ((response.data?.changePassword as RegularUserResponseFragment).user) {
                        router.push("/")
                    }

                    
                }}>
                    {({isSubmitting}) => (
                        <Form>
                        <Box mt={4}>
                            <InputField 
                                name="newPassword"
                                placeholder='Enter new password'
                                label='New Password'
                                type="password" 
                        />
                        </Box>

                        { tokenError ?

                         
                            <Flex>
                                <Box mr={2} style={{color: "red"}}> 
                                    {tokenError}
                                </Box>

                                <NextLink href="/forgot-password">
                                    <Link> click here to get a new one </Link>
                                </NextLink>
                                
                            </Flex>
                         
                         : null }

                         <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Change password</Button>
                        </Form>
                    )}
                </Formik>
                </Wrapper>
        </>
    )
}


export default createWithAp({ssr:true})(ChangePassword) 
