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

    static async getCategories(queryRunner: QueryRunner, data: any) {
        let { user_id, tipo_transaccion_id } = data;
        let categories = await queryRunner.manager.getRepository(Category).findBy({ user_id, tipo_transaccion_id, estado: true });
        return { categories };
    }

    static async saveCategory(queryRunner: QueryRunner, data: any) {
        let category = new Category();
        category.nombre = data.nombre;
        category.descripcion = data.descripcion;
        category.tipo_transaccion_id = data.tipo_transaccion_id;
        category.user_id = data.user_id;
        if (!(await queryRunner.manager.save(category))) {
            throw new Error("No se pudo guardar la categoría");
        }
        return { category };
    }
}