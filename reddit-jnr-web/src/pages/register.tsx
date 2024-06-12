import React from 'react'
import {Form, Formik} from "formik"
import Box from '@chakra-ui/core/dist/Box';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/button';
import { useRegisterMutation } from "../generated/graphql"
import { toErrorMap } from '../ultis/toErrorMap';
import { useRouter } from 'next/router';

interface registerProps {

}


export const Register: React.FC<registerProps> = () => {
    const router = useRouter()

    const [,register] =  useRegisterMutation()
        return (
        <Wrapper variant='small'>


            <Formik initialValues={{username:"", password:""}} onSubmit={ async (values, {setErrors}) => {
                const response = await register(values)
                if (response.data.register?.errors) {
                    setErrors(toErrorMap(response.data.register.errors))
                }else if (response.data?.register.user) {
                    router.push("/")
                }
            }}>
                {({isSubmitting}) => (
                    <Form>
                       <InputField 
                            name="username"
                            placeholder='Username'
                            label='username'
                       />

                    <Box mt={4}>
                        <InputField 
                            name="password"
                            placeholder='password'
                            label='Password'
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
export default Register


