import { useRouter } from "next/router"

const useGetIntId = () => {
    const router = useRouter()
    const {id} = router.query
    
    const intId = typeof id === "string" ? parseInt(id) : -1 
    
    return intId 
}

export default useGetIntId