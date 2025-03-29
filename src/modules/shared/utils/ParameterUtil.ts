import { QueryRunner } from "typeorm";
import { Parameter } from "../entities/Parameter";

export class ParameterUtil {

    static async getParameter(queryRunner: QueryRunner, data: any) {
        let { parametro_valor, parametro_clave } = data;
        let parameter = await queryRunner.manager.getRepository(Parameter).findOneBy({ parametro_valor, parametro_clave, estado: true });
        if (!parameter) {
            throw new Error("No se encontró el parámetro");
        }
        return { parameter };
    }
}