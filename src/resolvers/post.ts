import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import { Ctx, Query, Resolver, Arg, Int, Mutation } from "type-graphql";

@Resolver() 
export class PostResolver {

    @Query(() => [Post])
    posts (
        @Ctx() {em}: MyContext
    ) : Promise<Post[]> {
        return em.find(Post, {}) 
    }

    @Query(() => Post, {nullable:true})
    post ( 
        @Arg('_id', () => Int) _id:number, 
        @Ctx() {em}: MyContext
    ) : Promise<Post | null> {
        return em.findOne(Post, {_id}) 
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title:String,
        @Ctx() {em}:MyContext 
    ): Promise <Post> {

       const post = em.create(Post, {title:"This is from Apollo"}) 
        await em.fork({}).persistAndFlush(post)
        return post
    }


    @Mutation(() => Post, {nullable:true})
    async updatePost(
        @Arg("_id") _id:number,
        @Arg("title", () => String, {nullable:true}) title:String, 
        @Ctx() {em}:MyContext
    ): Promise<Post | null>{
        const post = await em.findOne(Post, {_id}) 
       
        if (!post) {
            return null
        }

        if (typeof title !== "undefined"){
            post.title = title 
            await em.fork({}).persistAndFlush(post) 
        }

        return post; 
    }  

    @Mutation(() => Boolean) 
    async deletePost(
        @Arg("_id") _id:number, 
        @Ctx() {em}:MyContext 
    ): Promise<boolean>{
        try {
            await em.nativeDelete(Post, {_id})
        } catch (error) {
            if (error) return false 
        }
        
        return true
    }

}
