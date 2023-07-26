import { Router } from "express";
import { getGames, newGame } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGames);//IMPORTAR
gamesRouter.post('/games', newGame);

export default gamesRouter;