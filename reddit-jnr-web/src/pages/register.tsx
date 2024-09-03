import React from 'react'
import {Form, Formik} from "formik"
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';

import Box from '@chakra-ui/core/dist/Box';
import { Button } from '@chakra-ui/button';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

import { RegularUserResponseFragment, useRegisterMutation } from "../generated/graphql"
import { toErrorMap } from '../ultis/toErrorMap';
import { createUrqlClient } from '../ultis/createUrqlClient';
import { transformErrors } from '../ultis/trasformer';

import { createWithAp } from '../ultis/withApollo';
import { MeDocument, MeQuery } from '../generated/types';

interface registerProps {}

export const Register: React.FC<registerProps> = () => {
    const router = useRouter()

    const [register] =  useRegisterMutation()
        return (
        <Wrapper variant='small'>


            <Formik initialValues={{username:"", email:"", password:""}} onSubmit={ async (values, {setErrors}) => {
                const response = await register({ variables: { options: values }, update:(cache, {data}) => {
                    cache.writeQuery<MeQuery>({
                        query: MeDocument, 
                        data: {
                            __typename:"Query", 
                            me:{ 
                                __typename: "UserResponse",
                                user: data?.register.user
                            }
                        }
                    })
                } })
              
                if ( (response.data?.register as RegularUserResponseFragment).errors)  {

                    const error = (response.data?.register as RegularUserResponseFragment).errors  

                        const errorMap = transformErrors(error)  
                        const toErrorMapV = toErrorMap(errorMap) 

                        const sepError = JSON.parse( JSON.stringify(toErrorMapV) ) 
                        setErrors(sepError) 

                }else if ((response.data?.register as RegularUserResponseFragment).user) {
                    router.push("/")
                }
            }}>
                {({isSubmitting}) => (
                    <Form>
                       <InputField 
                            name="username"
                            placeholder='username'
                            label='username'
                       />

                        <Box mt={4}>
                        <InputField 
                            name="email"
                            placeholder='email'
                            label='email'
                       />
                       </Box>

                    <Box mt={4}>
                        <InputField 
                            name="password"
                            placeholder='password'
                            label='password'
                            type="password"
                       />
                    </Box>

                    <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Register</Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        );
}
export default createWithAp ({ssr:false}) (Register)


