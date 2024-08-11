import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import {Query, Resolver, Arg, Mutation, Ctx, Field, InputType, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@InputType() 
class PostInput {
    @Field() 
    title: string 

    @Field() 
    text:string 
}

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
    @UseMiddleware(isAuth) 
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx () {req, dataSource} : MyContext 
    ): Promise <Post> {

        let post 

        try{
       const result = await  dataSource 
        .createQueryBuilder() 
        .insert()
        .into(Post)
        .values({ ...input, creatorId: req.session.userId })
        .returning("*")
        .execute() 
        
        post = result.raw[0] 

        } catch (error) {
            console.log(error)         
        }
    
        //return await Post.create({title}).save()
        
        return post 
    }


    @Mutation(() => Post, { nullable:true })
    async updatePost(
        @Arg("id") id:number,
        @Arg("title", () => String, { nullable:true }) title:String, 
        @Ctx (){dataSource}:MyContext
    
    ): Promise<Post | null > {
       let post = await Post.findOne({ where: { id } }) 
        
       if (!post) {
            return null  
        }

       
        try {
            const result = await dataSource
            .createQueryBuilder()
            .update(Post)
            .set({title})
            .where({id: post.id}) 
            .returning("*")
            .execute() 

            post = result.raw[0] 

        } catch (error) {
            console.log(error.message) 
        }
       
        return post; 
    }  


    @Mutation(() => Boolean) 
    async deletePost(
        @Arg("id") id:number, 
    ): Promise<boolean> {

        await Post.delete({id})
        return true
    }

}

