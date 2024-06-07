require('dotenv').config()

import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import session from "express-session" 
import { MyContext } from "./types"
import Redis from "ioredis"


//import {createClient} from "redis"
//const {ServerRegistration} = require("../node_modules/apollo-server-express/dist/ApolloServer")



const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app= express()

    app.set("trust proxy",true);
    app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    app.set("Access-Control-Allow-Credentials", true);

    const RedisStore = require("connect-redis").default;

    //Connect with local redis 

    // const redisClient = await createClient()
    // await redisClient.connect()


    const client = new Redis("rediss://default:Aa3PAAIncDE2NDkzYjFiODMyNDg0ZTU5ODU2NjkyNTdkOGQyMmU0OHAxNDQ0OTU@possible-chow-44495.upstash.io:6379");



    app.use(
        session({
            name:"qid", 
            store: new RedisStore({
                client
            }), 
            cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
                httpOnly: true,
                sameSite: "none",
                secure: true,
            }, 
            secret: "t4t3t3tg432v342242#$@#@$@#@$", 
            resave:false, 
            saveUninitialized:false
        })
    )


    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver, UserResolver], 
            validate:false
        }), 
        context: ({req,res}) : MyContext => ({em:orm.em, req,res}) 
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: { credentials: true, origin: "https://studio.apollographql.com" } } ) 


    const port = 4000
    app.listen(port, () => {
        console.log(`server started on localhost:${port}`)
    })

}

main().catch(error => {
    console.log(error)
})