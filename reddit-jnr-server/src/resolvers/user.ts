import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Ctx, Resolver, Arg, Mutation, Field, ObjectType, Query } from "type-graphql";
import argon2 from "argon2"
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "../ultis/UsernamePasswordInput";
import { validateRegister } from "../ultis/validateRegister";
import {v4} from "uuid"
import { sendEmail } from "../ultis/sendEmail";

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
    async changePassword(
       @Arg('token') token: string,    
       @Arg('newPassword') newPassword: string,    
        @Ctx() {em, client, req}: MyContext 
    ): Promise<UserResponse> { 

        
        if (newPassword.length <=2) {
            
            return { errors: [
                {
                    field:"newPassword", 
                    message:"length must be greater than 2"
                }
            ]}
        }

        const key = FORGOT_PASSWORD_PREFIX + token        
        const userId = await client.get(FORGOT_PASSWORD_PREFIX + token)
        if (!userId) {
            return{ errors: [{
                field:"token", 
                message:"expired token"
            }]}
        }


        const user = await em.findOne(User, {id: Number(userId) }) 
        if (!user) {
            return {
                errors: [
                    {
                        field:"token", 
                        message:"user no longer exists"
                    }
                ]
            }
        }

        user.password  = await argon2.hash(newPassword) 
        await em.persistAndFlush(user) 
        
        await client.del(key) 
        req.session.userId = user.id 
        return { user } 
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email:string,
        @Ctx() {em, client}:MyContext
    ){
        const user = await em.findOne(User, {email})  
      
        if (!user) {
            return true 
        }
        
        const token = v4()
        
        try {
            await client.set(FORGOT_PASSWORD_PREFIX+token, user.id, "EX", 1000 * 60 * 60 * 24 * 3)   
        } catch (error) {
            console.log(`Error message: ${error}`) 
        }
        
        await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Forgot password</a>`)
        return true 
    }


    @Mutation(() => UserResponse) 
    async register(
        @Arg('options') options: UsernamePasswordInput, 
        @Ctx() {em, req}:MyContext
    ): Promise <UserResponse> {

        const errors = validateRegister(options) 
        if (errors) {
            return {errors} 
        }
        
        const emFork = em.fork({})
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword, 
            email: options.email
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
        @Arg ('usernameOrEmail') usernameOrEmail: string, 
        @Arg ('password') password: string, 

        @Ctx() {em, req}: MyContext 
    ) : Promise <UserResponse> {
        
        const user = await em.findOne(User, usernameOrEmail.includes("@") ? {email: usernameOrEmail} : { username: usernameOrEmail})
        if (!user) {
            return { errors: [{
                field:"username", 
                message:"that username does not exists"
            }]
        }}
        
    const valid = await argon2.verify(user?.password, password) 
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