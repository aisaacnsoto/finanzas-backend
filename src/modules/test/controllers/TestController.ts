import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Budget } from "../../budgets/entities/Budget";
import { WhatsAppUtil } from "../../whatsapp/utils/WhatsAppUtil";
import { WhatsAppTemplate } from "../../whatsapp/utils/WhatsAppTemplate";
import { DateTime } from "luxon";

export class TestController {

    async test(request: Request, response: Response, next: NextFunction) {
        const fechaActual = DateTime.now().setLocale('es');
        const mesYAnio = fechaActual.toFormat('MMMM yyyy');
        const mesConPrimeraLetraMayuscula = mesYAnio.charAt(0).toUpperCase() + mesYAnio.slice(1);
        let data = {
            user: 'Alonso',
            categoria: 'Transporte',
            monto: 200,
            mes: mesConPrimeraLetraMayuscula
        };
        let template = WhatsAppUtil.getMessage(WhatsAppTemplate.TEMPLATE_REGISTRO_PRESUPUESTO, data);
        
        response.status(200).json({ "message": "api working!!!",template });
    }

}