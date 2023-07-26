import joi from "joi";

export const clientsSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().pattern(/^\d+$/).length(10,11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().iso().required()
});