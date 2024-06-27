require('dotenv').config()

import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import session from "express-session" 
import { createClient } from "redis"
import cors from "cors"

//import Redis from "ioredis"




const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app = express()
    app.use(cors({
        origin:["https://studio.apollographql.com", "http://localhost:3000"],
        credentials:true
    }))

    app.set("trust proxy",true);
    app.set("Access-Control-Allow-Origin", ["https://studio.apollographql.com", "http://localhost:3000"]);
    app.set("Access-Control-Allow-Credentials", true);

    const RedisStore = require("connect-redis").default;

    //Connect with local redis 
    const client = await createClient()
    await client.connect()

    //const client = new Redis(process.env.redisConnectionString || "");

    app.use(
        session({
            name:COOKIE_NAME, 
            store: new RedisStore({
                client
            }), 
            cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
                httpOnly: true,
                sameSite: "lax",
                secure: false,
            }, 
            secret: process.env.sessionSecret || "", 
            resave:false, 
            saveUninitialized:true
        }) 
    )


    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver, UserResolver], 
            validate:false
        }), 
        context: ({req,res}) => ({em:orm.em, req,res}) 
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors:false } ) 


    const port = 4000
    app.listen(port, () => {
        console.log(`server started on localhost:${port}`)
    }) 

}

main().catch(error => {
    console.log(error)
})