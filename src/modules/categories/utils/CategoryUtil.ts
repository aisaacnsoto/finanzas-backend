import { QueryRunner } from "typeorm";
import { Category } from "../entities/Category";

export class CategoryUtil {

    static async getCategory(queryRunner: QueryRunner, data: any) {
        let { id, user_id } = data;
        let category = await queryRunner.manager.getRepository(Category).findOneBy({ id, user_id, estado: true });
        if (!category) {
            throw new Error("No se encontró la categoría");
        }
        return { category };
    }
}