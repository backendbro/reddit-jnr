import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import {ExpressContext } from "apollo-server-express"


export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: ExpressContext['req'];
    res: ExpressContext['res'];
}