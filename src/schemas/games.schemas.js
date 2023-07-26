import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.string().trim().required(),
    stockTotal: joi.number().integer().greater(0),
    pricePerDay: joi.number().greater(0)
})