import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { User } from "./entities/User";


export default {
    migrations:{
        path: path.join(__dirname, "./migrations"), 
        pattern:/^[\w-]+d\+\.[tj]s$/
    },
    extensions:[Migrator],
    entities:[Post, User],
    allowGlobalContext:true,
    driver:PostgreSqlDriver,
    dbName:"redditjnr",
    password:"islam123",
    debug:!__prod__
} as Parameters<typeof MikroORM.init>[0]