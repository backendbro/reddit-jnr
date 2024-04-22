import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
import mikroOrmConfig from "./mikro-orm.config"
import express from "express"
import {ApolloServer} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    await orm.getMigrator().up();

    const app = express()

    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver], 
            validate:false
        }), 
        context: () => ({em: orm.em})
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