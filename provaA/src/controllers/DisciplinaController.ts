import { Request, Response } from "express";
import Disciplina from "../schemas/Disciplina";

class DisciplinaController {
    public async create(req: Request, res: Response): Promise<any> {
        const { descricao, curso, semestre } = req.body;

        try {
            const disciplina = new Disciplina({ descricao, curso, semestre });
            const savedDisciplina = await disciplina.save();
            return res.json(savedDisciplina);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Já existe uma disciplina com esses dados!" });
            } else if (error && error.errors) {
                const errorMessage = error.errors.descricao ? error.errors.descricao.message :
                                    error.errors.curso ? error.errors.curso.message :
                                    error.errors.semestre ? error.errors.semestre.message : 
                                    "Erro desconhecido!";
                return res.json({ message: errorMessage });
            }
            return res.json({ message: error.message });
        }
    }

    public async list(_: Request, res: Response): Promise<any> {
        try {
            const disciplinas = await Disciplina.find().sort({ descricao: "asc" });
            return res.json(disciplinas);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.body;
        try {
            const deletedDisciplina = await Disciplina.findByIdAndDelete(id);
            if (deletedDisciplina) {
                return res.json({ message: "Disciplina excluída com sucesso!" });
            } else {
                return res.json({ message: "Disciplina inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id, descricao, curso, semestre } = req.body;
        try {
            const disciplina = await Disciplina.findById(id);
            if (!disciplina) {
                return res.json({ message: "Disciplina inexistente!" });
            }

            disciplina.descricao = descricao;
            disciplina.curso = curso;
            disciplina.semestre = semestre;

            const updatedDisciplina = await disciplina.save();
            return res.json(updatedDisciplina);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Já existe uma disciplina com esses dados!" });
            } else if (error && error.errors) {
                const errorMessage = error.errors.descricao ? error.errors.descricao.message :
                                    error.errors.curso ? error.errors.curso.message :
                                    error.errors.semestre ? error.errors.semestre.message : 
                                    "Erro desconhecido!";
                return res.json({ message: errorMessage });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new DisciplinaController();
