require('dotenv').config()

import "reflect-metadata"
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';

import { COOKIE_NAME, __prod__ } from "./constants"
import express from "express"
import {ApolloServer} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import session from "express-session" 
import { createClient } from "redis"
import {DataSource } from "typeorm"
import cors from "cors"
import { Post } from "./entities/Post"
import { User } from "./entities/User"

//import {Redis} from "ioredis"

const main = async () => {
    
    const dataSource = new DataSource ({
        type:"postgres", 
        database:'lilreddit2', 
        username:"postgres", 
        password:'islam123', 
        logging:true, 
        synchronize:true, 
        entities: [Post, User]         
    })
    
    dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

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
        context: ({req,res}) => ({req,res, dataSource, client}),
        cache: new InMemoryLRUCache({
            maxSize: Math.pow(2, 20) * 100,
            ttl: 300,
          })
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