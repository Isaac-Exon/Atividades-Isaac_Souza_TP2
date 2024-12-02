import { Request, Response } from "express";
import Mensalista from "../schemas/Mensalista";
import Funcionario from "../schemas/Funcionario";

class MensalistaController {
  public async create(req: Request, res: Response): Promise<any> {
    const { matricula, salario, funcionario } = req.body; // 'funcionario' é o nome enviado no JSON
    try {
      // Busca o funcionário pelo nome
      const funcionarioEncontrado = await Funcionario.findOne({
        nome: funcionario,
      });

      if (!funcionarioEncontrado) {
        return res.status(404).json({
          message: `Funcionário com o nome "${funcionario}" não foi encontrado.`,
        });
      }

      // Cria o Mensalista com o nome do funcionário encontrado
      const mensalista = new Mensalista({
        matricula,
        salario,
        funcionario: funcionarioEncontrado.nome, // Salva o nome do funcionário
      });

      const savedMensalista = await mensalista.save();
      return res.status(201).json(savedMensalista);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao criar mensalista", error: error.message });
    }
  }

  public async list(_: Request, res: Response): Promise<any> {
    try {
      const mensalistas = await Mensalista.find().sort({ matricula: "asc" });
      return res.json(mensalistas);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao listar mensalistas", error: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
      const deletedMensalista = await Mensalista.findByIdAndDelete(id);
      if (deletedMensalista) {
        return res.json({ message: "Mensalista excluído com sucesso!" });
      } else {
        return res.status(404).json({ message: "Mensalista não encontrado!" });
      }
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao excluir mensalista", error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { id, matricula, salario, funcionario } = req.body;
    try {
      const mensalista = await Mensalista.findById(id);
      if (!mensalista) {
        return res.status(404).json({ message: "Mensalista não encontrado!" });
      }

      // Se o nome do funcionário foi enviado, valida a existência do funcionário
      if (funcionario) {
        const funcionarioEncontrado = await Funcionario.findOne({
          nome: funcionario,
        });
        if (!funcionarioEncontrado) {
          return res.status(404).json({
            message: `Funcionário com o nome "${funcionario}" não foi encontrado.`,
          });
        }
        mensalista.funcionario = funcionarioEncontrado.nome; // Atualiza o nome do funcionário
      }

      mensalista.matricula = matricula;
      mensalista.salario = salario;

      const updatedMensalista = await mensalista.save();
      return res.json(updatedMensalista);
    } catch (error: any) {
      return res.status(400).json({
        message: "Erro ao atualizar mensalista",
        error: error.message,
      });
    }
  }
}
export default new MensalistaController();
