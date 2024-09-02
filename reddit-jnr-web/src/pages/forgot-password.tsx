import { Box, Flex, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React from 'react' 
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { useState } from 'react'
 
const ForgotPassword: React.FC <{}> = ({}) => {
    const [forgotPassword] = useForgotPasswordMutation() 
    const [complete, setComplete] = useState(false)     
    return (
            <Wrapper variant='small'>


                <Formik initialValues={{email:""}} onSubmit={ async (values) => {
                    await forgotPassword( { variables: values} )
                    setComplete(true) 
                        }}>
                            {({isSubmitting}) => complete ? 
                            <Box>Password Reset We have sent you an e-mail. 
                                Please contact us if you do not receive it within a few minutes.
                            </Box> : (
                                <Form>
                                <Box mt={4}>
                                    <InputField 
                                        name="email"
                                        placeholder='Enter email'
                                        label='Email'
                                        type="email"
                                />
                                </Box>

                            <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Change email</Button>
                            </Form>
                        )}
                    </Formik>
                    </Wrapper>
    )
}

export default ForgotPassword