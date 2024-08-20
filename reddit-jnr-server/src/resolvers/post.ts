import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import {Query, Resolver, Arg, Mutation, Ctx, Field, InputType, UseMiddleware, Int, Root, FieldResolver, ObjectType } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@InputType() 
class PostInput {
    @Field() 
    title: string 

    @Field() 
    text:string 
}

@ObjectType() 
class PaginatedPosts { 
    @Field(() => [Post])
    posts: Post[]
    
    @Field()
    hasMore: boolean
}

@Resolver(Post)  
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet( @Root() root: Post ) 
    {
        return root.text.slice(0, 50)
    } 


    @Query(() => PaginatedPosts)
    async posts (
        @Arg ("limit", () => Int) limit: number, 
        @Arg ("cursor", () => String, {nullable:true}) cursor: string | null,  
        @Ctx() {dataSource}: MyContext 
    ) : Promise<PaginatedPosts> {

        
        const realLimit = Math.min(50, limit)
        const realLimitPlusOne = Math.min(50, limit) + 1

        let qb = await dataSource 
        .getRepository(Post)
        .createQueryBuilder("p") 
        .orderBy('"createdAt"', "DESC")
        .take(realLimitPlusOne)
    

        if (cursor) {
            qb.where('"createdAt" < :cursor',  { cursor: new Date(parseInt(cursor))}) 
        }

        const posts = await qb.getMany() 


        return {posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne}  
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

