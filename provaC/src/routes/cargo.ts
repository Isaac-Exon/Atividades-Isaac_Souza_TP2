import { Router } from "express";
import CargoController from "../controllers/CargoController";

const cargoRoutes = Router();

cargoRoutes.post("/", CargoController.create);
cargoRoutes.get("/", CargoController.list);
cargoRoutes.delete("/", CargoController.delete);
cargoRoutes.put("/", CargoController.update);

export default cargoRoutes;
