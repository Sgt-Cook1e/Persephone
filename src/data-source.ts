import "reflect-metadata";
import { DataSource } from "typeorm";
import { DGuild } from "./entity/guild";
import { DMember } from "./entity/user";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: `${process.env.MONGO}`,
    database: "Dataclear",
    synchronize: true,
    logging: false,
    entities: [DGuild, DMember],
    migrations: [],
    subscribers: [],
    useUnifiedTopology: true,
    retryWrites: true
});