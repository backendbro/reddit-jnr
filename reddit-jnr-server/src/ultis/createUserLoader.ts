import DataLoader from "dataloader"
import { User } from "../entities/User"
import { In } from "typeorm"


export const createUserLoader = () => new DataLoader<number, User>( async (userIds) => {

    const users = await User.find({
        where: {
            id: In(userIds as number[])
        }
    })

    const userIdsToUsers: Record <number, User> = {} 
    users.forEach((user) => {
        userIdsToUsers[user.id] = user 
    })

    const sortedUsers =  userIds.map((userId) => userIdsToUsers[userId]) 
    return sortedUsers
});

// const batchUsers  = async (userIds: number[]) => {
   
//     const users = await User.find({
//         where: {
//             id: In(userIds as number[]) 
//         }
//     })

//     const userMap: Record<number, User> = {}  
//     users.forEach((user) => {
//         userMap[user.id] = user 
//     })
    

//     return userIds.map((userId) =>  { users[userId] })
// }




