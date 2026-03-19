import Router from "express";
import { chatAI, listModels } from "../controllers/Chat.js";
import { checkAdmin, checkAuth } from "../middlewares/middleAuth.js";

const chatRouter = Router();
chatRouter.post("/", checkAuth, chatAI);
chatRouter.get("/models", checkAdmin, listModels);

export default chatRouter;
