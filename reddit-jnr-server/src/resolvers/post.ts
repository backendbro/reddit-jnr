import { Post } from "../entities/Post";
import {Query, Resolver, Arg, Mutation } from "type-graphql";

@Resolver() 
export class PostResolver {

    @Query(() => [Post])
    async posts (
    ) : Promise<Post[]> {
        return await Post.find()
    }


    @Query(() => Post, {nullable:true})
    async post ( @Arg('id') id:number ) : Promise< Post | null > {
        const post = await Post.findOne({where: {id}})   
        if (!post) {
            return null  
        }
        return post;      
    }

    
    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String, {nullable:true}) title:String,
    ): Promise <Post> {
      return await Post.create({title}).save()
    }


    @Mutation(() => Post, {nullable:true})
    async updatePost(
        @Arg("id") id:number,
        @Arg("title", () => String, {nullable:true}) title:String, 
    ): Promise<Post | null>{
       const post = await Post.findOne({where: {id}}) 
        if (!post) {
            return null  
        }

        if(typeof title !== undefined) {
            post.title = title 
        }
       
        post.save()
        return post; 
    }  


    @Mutation(() => Boolean) 
    async deletePost(
        @Arg("id") id:number, 
    ): Promise<boolean>{
        await Post.delete({id})
        return true
    }

}

