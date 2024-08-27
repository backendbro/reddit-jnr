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
        
        console.log({isUpdoot, userId})
        // const updoot = await Updoot.insert({ 
        //     userId, 
        //     postId, 
        //     value: realValue
        // })


        await dataSource.query(`
            START TRANSACTION;
            insert into updoot ("userId", "postId", value)
            values (${userId}, ${postId}, ${realValue});
            update post 
            set points = points + ${realValue} 
            where id = ${postId};  
            COMMIT;
            `,)

        return true 
    }
}