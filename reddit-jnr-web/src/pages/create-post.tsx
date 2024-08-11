import { Box, Flex, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import Link from "next/link"
import router from "next/router"
import React from "react"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { RegularUserResponseFragment } from "../generated/graphql"
import { toErrorMap } from "../ultis/toErrorMap"
import { transformErrors } from "../ultis/trasformer"

const createPost: React.FC <{}> = ({}) => {
    return (
        <Wrapper variant='small'>


        <Formik initialValues={{title:"", text:""}} onSubmit={ async (values, {setErrors}) => {
            console.log(values)
            // if ((response.data?.login as RegularUserResponseFragment).errors)  {
                    
            //         const error = (response.data?.login as RegularUserResponseFragment).errors 
            //         const errorMap = transformErrors(error) 
            //         const toErrorMapV = toErrorMap(errorMap)
                   
            //         //setErrors(toErrorMap(response.data.login.errors))

            //         const sepError = JSON.parse( JSON.stringify(toErrorMapV) ) 
                    
            //         if (sepError){
            //             setErrors (sepError) 
            //         }

            // } else if ((response.data?.login as RegularUserResponseFragment).user) {
            //     router.push("/")
            // }
        }}>
            {({isSubmitting}) => (
                <Form>
                   <InputField 
                        name="title"
                        placeholder='title'
                        label='title'
                   /> 

                <Box mt={4}>
                    <InputField 
                        name="text"
                        placeholder='text...'
                        label='Body'
                        textarea

                   />
                </Box>
                <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">create post</Button>
                </Form>
            )}
        </Formik>
        </Wrapper>
    )
}

export default createPost