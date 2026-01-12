import Router from "express";
import { chatAI, listModels } from "../controllers/Chat.js";

const chatRouter = Router();
chatRouter.post("/", chatAI);
chatRouter.get("/models", listModels);

export default chatRouter;