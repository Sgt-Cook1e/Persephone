import "reflect-metadata";
import { DataSource } from "typeorm";
import { DGuild } from "./entity/guild";
import { Tickets } from "./entity/ticket";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: `${process.env.MONGO}`,
    database: "Dataclear",
    synchronize: true,
    logging: false,
    entities: [DGuild, Tickets],
    migrations: [],
    subscribers: [],
    useUnifiedTopology: true,
    retryWrites: true
});