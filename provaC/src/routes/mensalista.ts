import { Router } from "express";
import MensalistaController from "../controllers/MensalistaController";

const mensalistaRoutes = Router();

mensalistaRoutes.post("/", MensalistaController.create);
mensalistaRoutes.get("/", MensalistaController.list);
mensalistaRoutes.delete("/", MensalistaController.delete);
mensalistaRoutes.put("/", MensalistaController.update);

export default mensalistaRoutes;
