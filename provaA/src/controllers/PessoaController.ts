import { Request, Response } from "express";
import Pessoa from "../schemas/Pessoa"; 
import PessoaModel from "../models/PessoaModel"; 

class PessoaController {
    public async create(req: Request, res: Response): Promise<any> {
        const { nome, idade, email, telefone } = req.body;
        try {
            const pessoa = new Pessoa({ nome, idade, email, telefone });
            const savedPessoa = await pessoa.save();

            return res.json(savedPessoa); 
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const errors: Record<string, string> = {};
                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
                return res.status(400).json({ message: "Erro de validação", errors });
            }
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este e-mail já está em uso!" });
            } 
            if (error && error.errors["email"]) {
                return res.json({ message: error.errors["email"].message });
            } else if (error && error.errors["nome"]) {
                return res.json({ message: error.errors["nome"].message });
            } else if (error && error.errors["telefone"]) {
                return res.json({ message: error.errors["telefone"].message });
            } else if (error && error.errors["idade"]) {
                return res.json({ message: error.errors["idade"].message });
            }
            return res.json({ message: error.message });
        }
    }

    public async list(_: Request, res: Response): Promise<any> {
        try {
            const pessoas = await Pessoa.find().sort({ nome: "asc" });
            return res.json(pessoas);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.body;
        try {
            const deletedPessoa = await Pessoa.findByIdAndDelete(id);
            if (deletedPessoa) {
                return res.json({ message: "Pessoa excluída com sucesso!" });
            } else {
                return res.json({ message: "Pessoa inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id, nome, idade, email, telefone } = req.body;
        try {
            const pessoa = await Pessoa.findById(id);
            if (!pessoa) {
                return res.json({ message: "Pessoa inexistente!" });
            }

            pessoa.nome = nome;
            pessoa.idade = idade;
            pessoa.email = email;
            pessoa.telefone = telefone;

            const updatedPessoa = await pessoa.save();
            return res.json(updatedPessoa);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este e-mail já está em uso!" });
            } else if (error && error.errors["email"]) {
                return res.json({ message: error.errors["email"].message });
            } else if (error && error.errors["nome"]) {
                return res.json({ message: error.errors["nome"].message });
            } else if (error && error.errors["telefone"]) {
                return res.json({ message: error.errors["telefone"].message });
            } else if (error && error.errors["idade"]) {
                return res.json({ message: error.errors["idade"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new PessoaController();
