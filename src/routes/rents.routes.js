import { Router } from "express";
import { deleteRent, finishRent, getRents, newRent } from "../controllers/rents.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { clientsSchema } from "../schemas/clients.schemas.js";

const rentsRouter = Router();

rentsRouter.get('/rentals', getRents);
rentsRouter.post('/rentals', validateSchema(clientsSchema) , newRent);
rentsRouter.post('/rentals/:id/return', finishRent);
rentsRouter.delete('/rentals/:id', deleteRent);

export default rentsRouter;