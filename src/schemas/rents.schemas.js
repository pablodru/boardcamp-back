import joi from "joi";


export const rentsSchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().greater(0).integer().required()
})