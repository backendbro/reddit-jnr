import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Session, SessionData } from "express-session";
import {ExpressContext } from "apollo-server-express"

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: ExpressContext['req'] & { session: Session & Partial<SessionData> & { userId?: number } };
    res: ExpressContext['res'];
}
