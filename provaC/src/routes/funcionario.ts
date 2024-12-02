import { Router } from "express";
import FuncionarioController from "../controllers/FuncionarioController";

const funcionarioRoutes = Router();

funcionarioRoutes.post("/", FuncionarioController.create);
funcionarioRoutes.get("/", FuncionarioController.list);
funcionarioRoutes.delete("/", FuncionarioController.delete);
funcionarioRoutes.put("/", FuncionarioController.update);

export default funcionarioRoutes;
