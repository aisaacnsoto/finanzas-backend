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
}