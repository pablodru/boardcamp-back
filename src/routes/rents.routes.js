import { Router } from "express";
import { deleteRent, finishRent, getRents, newRent } from "../controllers/rents.controllers.js";

const rentsRouter = Router();

rentsRouter.get('/rentals', getRents);
rentsRouter.post('/rentals', newRent);
rentsRouter.post('/rentals/:id/return', finishRent);
rentsRouter.delete('/rentals/:id', deleteRent);

export default rentsRouter;