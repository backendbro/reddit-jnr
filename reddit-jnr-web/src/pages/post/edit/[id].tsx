import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import InputField from "../../../components/InputField"
import Layout from "../../../components/Layout"
import useGetPostFromUrl from "../../../ultis/getSinglePost"
import { useUpdatePostMutation } from "../../../generated/graphql"
import useGetIntId from "../../../ultis/useGetIntId"
import { useRouter } from "next/router"
import { createWithAp } from "../../../ultis/withApollo"

const EditPost = () => {
    const router = useRouter()
    const intId = useGetIntId() 

    const {data, loading} = useGetPostFromUrl() 
    const [updatePost] = useUpdatePostMutation()
    
    if (loading) {
        return (
            <Layout>
                <Box>Loading...</Box>
            </Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>No post available</Box>
            </Layout>
        )
    }
    
    return (
            <Layout variant='small'>
    
    
            <Formik initialValues={{title:data.post.title, text:data.post.text}} onSubmit={ async (values, {setErrors}) => {
                await updatePost({variables: {id: intId, ...values}}) 
                router.back()
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
                    <Button type="submit" mt={4} isLoading={isSubmitting} color="white" bgColor="teal">update post</Button>
                    </Form>
                )}
            </Formik>
            </Layout>
        )
}

export default createWithAp({ssr:false})(EditPost)