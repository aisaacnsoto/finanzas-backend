import { QueryRunner } from "typeorm";
import { Person } from "../entities/Person";
import { User } from "../entities/User";

export class UserUtil {

    static async getUser(queryRunner: QueryRunner, data: any) {
        let {
            phone_number,
        } = data;
        let person = await queryRunner.manager.getRepository(Person).findOneBy({ phone_number, estado: true });
        if (!person) {
            throw new Error("No se encontró la persona");
        }
        let user = await queryRunner.manager.getRepository(User).findOneBy({ person: { id: person.id }, estado: true });
        if (!user) {
            throw new Error("No se encontró el usuario");
        }
        return { person, user };
    }
}