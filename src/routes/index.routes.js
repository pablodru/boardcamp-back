import { Router } from "express";
import clientsRouter from "./clients.routes.js";
import gamesRouter from "./games.routes.js";
import rentsRouter from "./rents.routes.js";

const router = Router();

router.use(clientsRouter);
router.use(gamesRouter);
router.use(rentsRouter);

export default router;