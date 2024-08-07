import React from 'react'
import {Form, Formik} from "formik"
import Box from '@chakra-ui/core/dist/Box';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import { useLoginMutation } from "../generated/graphql"
import { toErrorMap } from '../ultis/toErrorMap';
import { useRouter } from 'next/router';
// import { withUrqlClient } from 'next-urql';
// import { createUrqlClient } from '../ultis/createUrqlClient';


interface loginProps {}

export const Login: React.FC<loginProps> = () => {
    const router = useRouter()

    const [,login] =  useLoginMutation 
    ()
        return (
        <Wrapper variant='small'>


            <Formik initialValues={{usernameOrEmail:"", password:""}} onSubmit={ async (values, {setErrors}) => {
                const response = await login(values)
            
                if (response.data.login?.errors) {
                    setErrors(toErrorMap(response.data.login.errors))
                } else if (response.data?.login.user) {
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

                    <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Login</Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        );
}

export default Login
//export default withUrqlClient(createUrqlClient) (Login)