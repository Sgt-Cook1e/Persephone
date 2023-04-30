import { AppDataSource } from "../data-source";
import { EntityManager, EntityTarget, Repository } from "typeorm";

export default class Database {
    private static instance = new Database();
    public static getInstance: () => Database = () => Database.instance;

    private constructor() {
        AppDataSource.initialize()
    }

    public getRepo = async (repo: EntityTarget<any>): Promise<Repository<any>> => {
        return AppDataSource.manager.getRepository(repo);
    }

    getManager = async (): Promise<EntityManager> => {
        return AppDataSource.manager;
    }
}