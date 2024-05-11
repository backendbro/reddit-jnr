require('dotenv').config()

import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express, {Application} from "express"
import {ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import session from "express-session" 
import { MyContext } from "./types"
import {createClient} from "redis"


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

//const {ServerRegistration} = require("../node_modules/apollo-server-express/dist/ApolloServer")



const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app: Application = express()

    const RedisStore = require("connect-redis").default;
    const redisClient = await createClient()
    await redisClient.connect()

    app.use(
        session({
            name:envClient().name, 
            // remember to add disableTouch to your session.store options
            store: new RedisStore({
                client: redisClient,
                disableTouch:false, 
                ttl: 24 * 60 * 60
            }), 
            cookie:{
                maxAge: 2 * 60 * 60 * 1000, 
                httpOnly:true, 
                sameSite:"lax",
                secure: __prod__
            }, 
            secret: "t4t3t3tg432v342242#$@#@$@#@$", 
            resave:false, 
            saveUninitialized:true
        })
    )



    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver, UserResolver], 
            validate:false
        }), 
        context: ({req,res}): MyContext => ({em:orm.em, req,res}) 
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app }) 

    const port = 4000
    app.listen(port, () => {
        console.log(`server started on localhost:${port}`)
    })

}

main().catch(error => {
    console.log(error)
})