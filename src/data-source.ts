import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Account } from "./entity/Account";
import { Category } from "./entity/Category";
import { Parameter } from "./entity/Parameter";
import { Transaction } from "./entity/Transaction";
import { User } from "./entity/User";
import { Person } from "./entity/Person";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_DATASOURCE_HOST,
    port: parseInt(process.env.TYPEORM_DATASOURCE_PORT),
    username: process.env.TYPEORM_DATASOURCE_USERNAME,
    password: process.env.TYPEORM_DATASOURCE_PASSWORD,
    database: process.env.TYPEORM_DATASOURCE_DATABASE,
    // synchronize: true,
    logging: false,
    entities: [
        Account,
        Category,
        Parameter,
        Transaction,
        User,
        Person,
    ],
    migrations: [],
    subscribers: [],
});
