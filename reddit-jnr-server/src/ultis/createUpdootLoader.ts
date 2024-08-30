import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";
import { In } from "typeorm";

export const createUpdootLoader = () => 
    new DataLoader <{ postId: number, userId: number}, Updoot | null> ( 
        async (keys) => {
    
        const updoots = await Updoot.find({
            where: {
                postId: In(keys.map(key => key.postId)), 
                userId: In(keys.map(key => key.userId))
            }
        }) 

        const updootsIdsToUpdoot: Record <string, Updoot> = {}
        updoots.forEach((updoot) => {
            updootsIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot 
        })

        return keys.map(
            (key) => updootsIdsToUpdoot[`${key.userId}|${key.postId}`] 
        )
})
