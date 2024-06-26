import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Ctx, Resolver, Arg, Mutation, InputType, Field, ObjectType, Query } from "type-graphql";
import argon2 from "argon2"
import { COOKIE_NAME } from "../constants";

//import { EntityManager } from "@mikro-orm/postgresql";

@InputType() 
class UsernamePasswordInput {
 @Field() 
 username:string 
 
 @Field()
 password:string
}


@ObjectType() 
class FieldError {
    @Field() 
    field:string 

    @Field()
    message:string 
}


@ObjectType () 
class UserResponse {
    @Field(() => [FieldError], {nullable:true}) 
    errors?: FieldError[]  

    @Field(() => User, {nullable:true})
    user?: User 
}



@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse) 
    async register(
        @Arg('options') options: UsernamePasswordInput, 
        @Ctx() {em, req}:MyContext
    ): Promise <UserResponse> {

        if (options.username.length <= 2) {
            return {
                errors: [{
                     field:"username", 
                     message:"Length must be greater than 2"
                }]
            }
        }

        if (options.password.length <= 2) {
            return {
                errors: [{
                    field:"password", 
                    message:"Length must be greater than 2"
                }]
            }
        }
        
        const emFork = em.fork({})
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword
        }) 
        
        
        // let user; 
        // try {
        //     const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        //         {
        //             username: options.username,
        //             password: hashedPassword, 
        //             created_at: new Date(), 
        //             updated_at: new Date()
        //         }
        //     ).returning ("*")
        
        // user = result[0]
        
        try{
            await emFork.persistAndFlush(user)
        } catch (error:any) {
            if (error.code === '23505') {
                return {
                    errors:[{
                        field:"username", 
                        message: error.detail
                    }]
                }
            }
            console.log("message", error.message)
        }
 
        req.session.userId = user.id
        return {user} 
    }

    @Mutation(() => UserResponse) 
    async login (
        @Arg ('options') options: UsernamePasswordInput, 
        @Ctx() {em, req}: MyContext 
    ) : Promise <UserResponse> {
        
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return { errors: [{
                field:"username", 
                message:"that username does not exists"
            }]
        }}
        
    const valid = await argon2.verify(user?.password, options.password) 
    if (!valid) {
        return {
            errors: [
                {
                    field:"password", 
                    message:"incorrect password"
                }
            ]
        }
    }

    req.session.userId = user.id
    return {user}
}  


@Query(() => UserResponse, {nullable:true})
async me(
    @Ctx() {em, req}: MyContext
) : Promise<UserResponse>{

    const userId = req.session.userId

    if (!userId) {
        return {
            errors:[{
                field:"req.session.userId", 
                message:"there is no userId in req.session"
            }]
        }
    }
    
    const user = await em.findOne(User, {id: Number(userId)})
    if (!user) {
        return { errors: [{
            field:"user", 
            message:"the suppose current user does not exist in the database"
        }]
    }}

    return {user} 
}

    @Mutation (() => Boolean) 
    logout(
        @Ctx(){req, res}:MyContext
    ){

        return new Promise (resolve => {
            try {
                req.session = null 
                res.clearCookie(COOKIE_NAME)
                resolve(true)
            } catch (error) {
                    console.log(error) 
                    resolve(false)
                }
        })
    }
}