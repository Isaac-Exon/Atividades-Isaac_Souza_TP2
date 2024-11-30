import {Router, Request, Response} from "express";
import pessoa from "./pessoa";
import estudante from "./estudante";
import disciplina from "./disciplina";
import express from "express";

const routes = Router();
const app = express();

app.use(express.json());
routes.use("/pessoa", pessoa);
routes.use("/estudante", estudante);
routes.use("/disciplina", disciplina);



export default routes