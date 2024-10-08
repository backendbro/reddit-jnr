import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMeQuery } from "../generated/graphql"

export const isAuth = () => {
    const {data, loading} = useMeQuery()
    const router = useRouter() 
    
    useEffect(() => {
        if (!loading && !data.me) {
            router.replace('/login?next=' + router.pathname)
        }
    }, [loading, data, router])
}