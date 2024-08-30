import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import {Query, Resolver, Arg, Mutation, Ctx, Field, InputType, UseMiddleware, Int, Root, FieldResolver, ObjectType } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";

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
    textSnippet( @Root() root: Post ) { 
        return root.text.slice(0, 50)
    } 

    @FieldResolver(() => User) 
    creator (
        @Root() post: Post, 
        @Ctx() {userLoader}: MyContext
    )
        {
             
        return userLoader.load(post.creatorId)
    }


    @FieldResolver(() => Int, {nullable: true}) 
    async voteStatus (
        @Root () post: Post, 
        @Ctx() {updootLoader, req}: MyContext 
    ) {
        if (!req.session.userId) {
            return null 
        }
        const updoot = await updootLoader.load({postId: post.id, userId: req.session.userId}) 
        return updoot ? updoot.value : null 
        } 


    @Query(() => PaginatedPosts)
    async posts (
        @Arg ("limit", () => Int) limit: number, 
        @Arg ("cursor", () => String, {nullable:true}) cursor: string | null,  
        @Ctx() {dataSource}: MyContext 
    ) : Promise<PaginatedPosts> {

        const realLimit = Math.min(50, limit)
        const realLimitPlusOne = Math.min(50, limit) + 1
        const replacements: any[] = [realLimitPlusOne] 
        
       
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
        }

        const posts = await dataSource.query (` 
            SELECT 
            p.*
            FROM 
                post p
            INNER JOIN 
                public.user u 
            ON 
                u.id = p."creatorId"
                ${cursor ? `where p."createdAt" < $2` : ""}
            ORDER BY 
                p."createdAt" DESC
            LIMIT $1;
            `, replacements)



        // let qb = await dataSource 
        // .getRepository(Post)
        // .createQueryBuilder("p") 
        // .innerJoinAndSelect(
        //     "p.creator", 
        //     "u", 
        //     'u.id = p."creatorId"'
        // )
        // .orderBy('p."createdAt"', "DESC")
        // .take(realLimitPlusOne)
    

        // if (cursor) {
        //     qb.where('p."createdAt" < :cursor',  { cursor: new Date(parseInt(cursor))}) 
        // }

        // const posts = await qb.getMany() 


        return {posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne}  
}


    @Query(() => Post, {nullable:true})
    async post ( @Arg('id', () => Int) id: number ) : Promise< Post | null > {

        const post = await Post.findOne({where:{ id}, relations: ["creator"]})    
        
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
    @UseMiddleware(isAuth) 
    async updatePost(
        @Arg("id", () => Int) id:number,
        @Arg("title", () => String, { nullable:true }) title:String, 
        @Arg("text", () => String, { nullable:true }) text:String, 
        @Ctx (){req, dataSource}:MyContext
    
    ): Promise<Post | null > {
       let post = await Post.findOne({ where: { id } }) 
        
       if (!post) {
            return null  
        }

       
        try {
            const result = await dataSource
            .createQueryBuilder()
            .update(Post)
            .set({title, text})
            .where('id = :id and "creatorId" = :creatorId', { 
                id: post.id, creatorId: req.session.userId
            }) 
            .returning("*")
            .execute() 

            post = result.raw[0] 

        } catch (error) {
            console.log(error.message) 
        }
       
        return post; 
    }  


    @Mutation(() => Boolean) 
    @UseMiddleware(isAuth) 
    async deletePost(
        @Arg("id", () => Int) id:number,
        @Ctx() {req}: MyContext 
    ): Promise<boolean> {
        // const post = await Post.findOne({where: {id}}) 
        // if (!post) {
        //     return false 
        // }

        // if (post.creatorId !== req.session.userId) {
        //     throw new Error ("not authorized")
        // }

        // await Updoot.delete({ id })
        // await Post.delete({ id })

        

        await Post.delete({id, creatorId: req.session.userId})
        return true
    }
}

