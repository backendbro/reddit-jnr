import React from 'react'
import {Form, Formik} from "formik"
import Box from '@chakra-ui/core/dist/Box';
import NextLink from "next/link"
import { Link, Flex } from "@chakra-ui/react"
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import { FieldError, RegularUserResponseFragment, useLoginMutation } from "../generated/graphql"
import { toErrorMap } from '../ultis/toErrorMap';
import { useRouter } from 'next/router';
// import { withUrqlClient } from 'next-urql';
// import { createUrqlClient } from '../ultis/createUrqlClient';


interface loginProps {}

export const Login: React.FC<loginProps> = () => {
    const router = useRouter()

    const [,login] =  useLoginMutation() 

    const transformErrors = (errors: Array<{ __typename?: "FieldError"; field?: string; message?: string }> | null): FieldError[] => {
  
        if (!errors) {
            return[] 
        }
        
        return errors.map(err => ({
          field: err.field || '',
          message: err.message || ''
        }));
      };
      
    
        return (
        <Wrapper variant='small'>


            <Formik initialValues={{usernameOrEmail:"", password:""}} onSubmit={ async (values, {setErrors}) => {
                const response = await login(values)
            


                if ((response.data?.login as RegularUserResponseFragment).errors)  {
                        
                        const error = (response.data?.login as RegularUserResponseFragment).errors 
                        const errorMap = transformErrors(error) 
                        const toErrorMapV = toErrorMap(errorMap)
                       
                        //setErrors(toErrorMap(response.data.login.errors))

                        const sepError = JSON.parse( JSON.stringify(toErrorMapV) ) 
                        
                        if (sepError){
                            setErrors (sepError) 
                        }

                } else if ((response.data?.login as RegularUserResponseFragment).user) {
                    router.push("/")
                }


            }}>
                {({isSubmitting}) => (
                    <Form>
                       <InputField 
                            name="usernameOrEmail"
                            placeholder='username Or Email'
                            label='username Or Email'
                       />

                    <Box mt={4}>
                        <InputField 
                            name="password"
                            placeholder='password'
                            label='Password'
                            type="password"
                       />
                    </Box>

                    <Flex mt={2}>
                        <NextLink  href="/forgot-password">
                            <Link ml="auto"> Forgot password? </Link>
                        </NextLink>
                    </Flex>

                    <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Login</Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        );
}

export default Login
//export default withUrqlClient(createUrqlClient) (Login)