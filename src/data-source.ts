import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Account } from "./modules/accounts/entities/Account";
import { Parameter } from "./modules/shared/entities/Parameter";
import { Person } from "./modules/users/entities/Person";
import { Category } from "./modules/categories/entities/Category";
import { Transaction } from "./modules/transactions/entities/Transaction";
import { User } from "./modules/users/entities/User";

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
