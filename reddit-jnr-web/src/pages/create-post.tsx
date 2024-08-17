import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import React, { useEffect } from "react"
import InputField from "../components/InputField"
import { useCreatePostMutation, useMeQuery } from "../generated/graphql"
import {useRouter} from "next/router" 
import Layout from "../components/Layout"
import { isAuth } from "../ultis/isAuth"

const createPost: React.FC <{}> = ({}) => {
    const router = useRouter()
    isAuth() 
    
    const [, createPost] = useCreatePostMutation()
    return (
        <Layout variant='small'>


        <Formik initialValues={{title:"", text:""}} onSubmit={ async (values, {setErrors}) => {
            const {error} = await createPost({input:values})

            if (error?.message.includes("not authenticated")){
                setErrors ({title:" ", text: error.message}) 
                router.replace("/login")
            } 

            router.push("/") 

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
        </Layout>
    )
}

export default createPost