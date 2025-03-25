import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { Person } from "../entity/Person";

export class CategoryController {

    async allByID(request: Request, response: Response, next: NextFunction) {
        try {
            // Obtener datos del request
            const { id } = request.params;
            let person = await AppDataSource.getRepository(Person).findOneBy({phone_number: id, estado: true});
            let user = await AppDataSource.getRepository(User).findOne({where: {person: {id: person.id}, estado: true}});
            let categories = await AppDataSource.getRepository(Category).findBy({user_id: user.id, estado: true});

            let categoriesNames = categories.map((category) => category.nombre).join(",");

            response.status(200).json({ data: categoriesNames });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        }
    }

}