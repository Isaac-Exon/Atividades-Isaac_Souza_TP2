import { Request, Response } from "express";
import Funcionario from "../schemas/Funcionario";

class FuncionarioController {
  public async create(req: Request, res: Response): Promise<any> {
    const { nome, idade, email, fone } = req.body;
    try {
      const funcionario = new Funcionario({ nome, idade, email, fone });
      const savedFuncionario = await funcionario.save();
      return res.json(savedFuncionario);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao criar funcionário", error: error.message });
    }
  }

  public async list(_: Request, res: Response): Promise<any> {
    try {
      const funcionarios = await Funcionario.find().sort({ nome: "asc" });
      return res.json(funcionarios);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao listar funcionários", error: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
      const deletedFuncionario = await Funcionario.findByIdAndDelete(id);
      if (deletedFuncionario) {
        return res.json({ message: "Funcionário excluído com sucesso!" });
      } else {
        return res.status(404).json({ message: "Funcionário não encontrado!" });
      }
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao excluir funcionário", error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { id, nome, idade, email, fone } = req.body;
    try {
      const funcionario = await Funcionario.findById(id);
      if (!funcionario) {
        return res.status(404).json({ message: "Funcionário não encontrado!" });
      }

      funcionario.nome = nome;
      funcionario.idade = idade;
      funcionario.email = email;
      funcionario.fone = fone;

      const updatedFuncionario = await funcionario.save();
      return res.json(updatedFuncionario);
    } catch (error: any) {
      return res
        .status(400)
        .json({
          message: "Erro ao atualizar funcionário",
          error: error.message,
        });
    }
  }
}

export default new FuncionarioController();
