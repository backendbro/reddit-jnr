import { Session, SessionData } from "express-session";
import {ExpressContext } from "apollo-server-express"
import { Redis } from "ioredis";
import { DataSource } from "typeorm";

export type MyContext = {
    req: ExpressContext['req'] & { session: Session & Partial<SessionData> & { userId?: number } };
    res: ExpressContext['res'];
    client: Redis,
    dataSource:DataSource
}
