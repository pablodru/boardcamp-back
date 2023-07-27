import { Router } from "express";
import { getCustomerById, getCustomers, newCustomer, updateCustomer } from "../controllers/clients.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { clientsSchema } from "../schemas/clients.schemas.js";


const clientsRouter = Router();

clientsRouter.get('/customers', getCustomers);
clientsRouter.get('/customers/:id', getCustomerById);
clientsRouter.post('/customers', validateSchema(clientsSchema) , newCustomer);
clientsRouter.put('/customers/:id', validateSchema(clientsSchema), updateCustomer);

export default clientsRouter;