import joi from "joi";

export const clientsSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().min(10).max(11).required().regex(/^\d+$/),
    cpf: joi.string().length(11).required().regex(/^\d+$/),
    birthday: joi.date().iso().required()
});