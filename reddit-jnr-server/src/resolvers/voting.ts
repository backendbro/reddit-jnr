import { Updoot } from "../entities/Updoot";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, UseMiddleware } from "type-graphql";


export class VotingResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Boolean) 
    async vote(
        @Arg("postId", () => Int) postId: number, 
        @Arg("value", () => Int) value: number, 
        @Ctx() {req, dataSource}: MyContext
    ) {
        
        
        const isUpdoot = value !== -1
        const realValue = isUpdoot ? 1 : -1 
        
        const { userId } = req.session 
        const updoot = await Updoot.findOne({where: {postId, userId}})
        if (updoot && updoot.value !== realValue) {
            await dataSource.transaction(async (tm) => {
                await tm.query (` 
                    update updoot 
                    set value = $1 
                    where "postId" = $2 and "userId" = $3
                    `, [realValue, postId, userId])
            
            
                await tm.query (` 
                    update post 
                    set points = points + $1  
                    where id = $2 
                    `, [2*realValue, postId])
            }) 

        } else if (!updoot) {
            await dataSource.transaction( async (tm) => {
                await tm.query (` 
                    insert into updoot ("userId", "postId", value)
                    values ($1, $2, $3)
                    `, [userId, postId, realValue])
            
            
                await tm.query(`
                    update post 
                    set points = points + $1 
                    where id = $2
                    `, [realValue, postId])
                })


        }
        


        // await dataSource.query(`
        //     START TRANSACTION;
        //     insert into updoot ("userId", "postId", value)
        //     values (${userId}, ${postId}, ${realValue});
        //     update post 
        //     set points = points + ${realValue} 
        //     where id = ${postId};  
        //     COMMIT;
        //     `,)

        return true 
    }
}