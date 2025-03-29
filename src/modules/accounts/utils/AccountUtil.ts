import { QueryRunner } from "typeorm";
import { Account } from "../entities/Account";

export class AccountUtil {

    static async getAccount(queryRunner: QueryRunner, data: any) {
        let { id, user_id } = data;
        let account = await queryRunner.manager.getRepository(Account).findOneBy({ id, user_id, estado: true });
        if (!account) {
            throw new Error("No se encontró la cuenta");
        }
        return { account };
    }

    static async getAccounts(queryRunner: QueryRunner, data: any) {
        let { user_id } = data;
        let accounts = await queryRunner.manager.getRepository(Account).findBy({ user_id, estado: true });
        return { accounts };
    }

    static async saveAccount(queryRunner: QueryRunner, data: any) {
        let account = new Account();
        account.nombre = data.nombre;
        account.descripcion = data.descripcion;
        account.user_id = data.user_id;
        if (!(await queryRunner.manager.save(account))) {
            throw new Error("No se pudo guardar la cuenta");
        }
        return { account };
    }
}