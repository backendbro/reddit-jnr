import { NextPage } from "next";
import {Form, Formik} from "formik"
import Box from '@chakra-ui/core/dist/Box';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { Button } from '@chakra-ui/button';
import { useLoginMutation } from "../../generated/graphql"
import { toErrorMap } from '../../ultis/toErrorMap';
import router, { useRouter } from 'next/router';


const ChangePassword: NextPage<{token:string}> = ({token}) => {
    
    return (
        <>
            <Wrapper variant='small'>


                <Formik initialValues={{newPassword:""}} onSubmit={ async (values, {setErrors}) => {
                    // const response = await login(values)
                
                    // if (response.data.login?.errors) {
                    //     setErrors(toErrorMap(response.data.login.errors))
                    // } else if (response.data?.login.user) {
                    //     router.push("/")
                    // }

                    console.log(values)
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

                        <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">Change password</Button>
                        </Form>
                    )}
                </Formik>
                </Wrapper>
        </>
    )
}

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string 
    }
}

export default ChangePassword 