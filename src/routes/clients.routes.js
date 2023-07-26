import { Router } from "express";
import { getCustomerById, getCustomers, newCustomer, updateCustomer } from "../controllers/clients.controllers.js";


const clientsRouter = Router();

clientsRouter.get('/customers', getCustomers);
clientsRouter.get('/customers/:id', getCustomerById);
clientsRouter.post('/customers', newCustomer);
clientsRouter.put('/customers/:id', updateCustomer);

export default clientsRouter;