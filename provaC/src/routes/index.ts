import { Router, Request, Response } from "express";

import express from "express";
import funcionarioRoutes from "./funcionario";
import cargoRoutes from "./cargo";
import mensalistaRoutes from "./mensalista";

const routes = Router();
const app = express();

app.use(express.json());
routes.use("/funcionario", funcionarioRoutes);
routes.use("/cargo", cargoRoutes);
routes.use("/mensalista", mensalistaRoutes);

export default routes;
