require('dotenv').config()

import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import { Redis } from "ioredis"
import session from "express-session" 
import { MyContext } from "./types"
import { Request, Response } from "express"

const envClient = () => {
    const envObj = {
        red:"",
        secret:"", 
        name:"", 
        maxAge:""
    }

    if (process.env.redisConnectionString){
        envObj.red = process.env.redisConnectionString
    }

    if (process.env.sessionSecret) {
        envObj.secret = process.env.sessionSecret
    }

    if (process.env.name) {
        envObj.name = process.env.name 
    }

    if (process.env.maxAge) {
        envObj.maxAge = process.env.maxAge
    }

    return envObj 
}


const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app = express()

    const RedisStore = require("connect-redis").default;
    const redisClient = new Redis(envClient().red) 

    app.use(
        session({
            name:envClient().name, 
            // remember to add disableTouch to your session.store options
            store: new RedisStore({
                client: redisClient,
                disableTouch:false
            }), 
            cookie:{
                maxAge: Number(envClient().maxAge), 
                httpOnly:true, 
                sameSite:"lax",
                secure: __prod__
            }, 
            secret: envClient().secret, 
            resave:false, 
            saveUninitialized:true
        })
    )




    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver, UserResolver], 
            validate:false
        }), 
        context: ({req, res}): MyContext => ({em: orm.em, req, res})
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({app}) 

    const port = 4000
    app.listen(port, () => {
        console.log(`server started on localhost:${port}`)
    })

}

main().catch(error => {
    console.log(error)
})