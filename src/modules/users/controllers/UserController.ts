import { AppDataSource } from "../../../data-source";
import { NextFunction, Request, Response } from "express";
import { Account } from "../../accounts/entities/Account";
import { Parameter } from "../../shared/entities/Parameter";
import { GlobalConstants } from "../../shared/utils/constants";
import { Person } from "../entities/Person";
import { User } from "../entities/User";
import { Category } from "../../categories/entities/Category";

export class UserController {

    async save(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Obtener datos del request
            const {
                first_name,
                last_name,
                email,
                phone_number,
                username,
                password_hash
            } = request.body;

            // Crear persona
            let person = await queryRunner.manager.findOneBy(Person, { phone_number, estado: true });
            if (person) {
                throw new Error("El número de teléfono ya está registrado");
            }
            person = new Person();
            person.first_name = first_name;
            person.last_name = last_name;
            person.email = email;
            person.phone_number = phone_number;
            await queryRunner.manager.save(person);

            // Crear usuario
            let user = await queryRunner.manager.findOneBy(User, { username, estado: true });
            if (user) {
                throw new Error("El nombre de usuario ya está registrado");
            }
            user = new User();
            user.person = person;
            user.username = username;
            user.password_hash = password_hash;
            await queryRunner.manager.save(user);

            // Crear cuentas por defecto
            const cuentasDefault = await queryRunner.manager.getRepository(Parameter).findBy({parametro_clave: GlobalConstants.KEY_DEFAULT_CUENTA, estado: true});
            for (let parametro of cuentasDefault) {
                let account = new Account();
                account.nombre = parametro.parametro_nombre;
                account.saldo = 0.00;
                account.user_id = user.id;
                await queryRunner.manager.save(account);
            }

            // Crear categorias de ingreso por defecto
            const categoriasIngresoDefault = await queryRunner.manager.getRepository(Parameter).findBy({parametro_clave: GlobalConstants.KEY_DEFAULT_CATEGORIA_INGRESO, estado: true});
            for (let parametro of categoriasIngresoDefault) {
                let category = new Category();
                category.nombre = parametro.parametro_nombre;
                category.tipo_transaccion_id = GlobalConstants.TIPO_TRANSACCION_INGRESO;
                category.user_id = user.id;
                await queryRunner.manager.save(category);
            }

            // Crear categorias de gasto por defecto
            const categoriasGastoDefault = await queryRunner.manager.getRepository(Parameter).findBy({parametro_clave: GlobalConstants.KEY_DEFAULT_CATEGORIA_GASTO, estado: true});
            for (let parametro of categoriasGastoDefault) {
                let category = new Category();
                category.nombre = parametro.parametro_nombre;
                category.tipo_transaccion_id = GlobalConstants.TIPO_TRANSACCION_GASTO;
                category.user_id = user.id;
                await queryRunner.manager.save(category);
            }

            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Usuario ha sido guardado." });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

}