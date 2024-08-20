require('dotenv').config()

import "reflect-metadata"
import { COOKIE_NAME, __prod__ } from "./constants"

import express from "express"
import session from "express-session" 
import cors from "cors"
//import { createClient } from "redis"

import {ApolloServer} from "apollo-server-express"
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import {DataSource } from "typeorm"
import { buildSchema } from "type-graphql"

import { PostResolver } from "./resolvers/post"
import { HelloResolver } from "./resolvers/hello"
import { UserResolver } from "./resolvers/user"


import { Post } from "./entities/Post"
import { User } from "./entities/User"

import {Redis} from "ioredis"
import path from "path"
 
const main = async () => {
    
    const dataSource = new DataSource ({
        type:"postgres", 
        database:'lilreddit2', 
        username:"postgres", 
        password:'islam123', 
        logging:true, 
        synchronize:false, 
        migrations:[path.join(__dirname, "./migrations/*")],
        entities: [Post, User]         
    })

    try {
        await dataSource.initialize()
        await dataSource.runMigrations()
    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }
    

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
    // const client = await createClient()
    // await client.connect()

    // connect with unsplash redis 
    const client = new Redis(process.env.redisConnectionString || "");

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
        cache: new InMemoryLRUCache({ // to prevent DOS attacks.
            maxSize: Math.pow(2, 20) * 100,
            ttl: 300,
          }), 
          introspection: true
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