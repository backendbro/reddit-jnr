import { Session, SessionData } from "express-session";
import {ExpressContext } from "apollo-server-express"
import { Redis } from "ioredis";
import { DataSource } from "typeorm";
import { createUserLoader } from "./ultis/createUserLoader";
import { createUpdootLoader } from "./ultis/createUpdootLoader";

export type MyContext = {
    req: ExpressContext['req'] & { session: Session & Partial<SessionData> & { userId?: number } };
    res: ExpressContext['res'];
    client: Redis,
    dataSource:DataSource, 
    userLoader: ReturnType<typeof createUserLoader>, 
    updootLoader: ReturnType<typeof createUpdootLoader>
}
