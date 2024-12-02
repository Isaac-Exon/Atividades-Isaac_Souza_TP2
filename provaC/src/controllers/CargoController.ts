import { Request, Response } from "express";
import Cargo from "../schemas/Cargo";

class CargoController {
  public async create(req: Request, res: Response): Promise<any> {
    const { cbo, descricao } = req.body;
    try {
      const cargo = new Cargo({ cbo, descricao });
      const savedCargo = await cargo.save();
      return res.json(savedCargo);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao criar cargo", error: error.message });
    }
  }

  public async list(_: Request, res: Response): Promise<any> {
    try {
      const cargos = await Cargo.find().sort({ descricao: "asc" });
      return res.json(cargos);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao listar cargos", error: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
      const deletedCargo = await Cargo.findByIdAndDelete(id);
      if (deletedCargo) {
        return res.json({ message: "Cargo excluído com sucesso!" });
      } else {
        return res.status(404).json({ message: "Cargo não encontrado!" });
      }
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao excluir cargo", error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { id, cbo, descricao } = req.body;
    try {
      const cargo = await Cargo.findById(id);
      if (!cargo) {
        return res.status(404).json({ message: "Cargo não encontrado!" });
      }

      cargo.cbo = cbo;
      cargo.descricao = descricao;

      const updatedCargo = await cargo.save();
      return res.json(updatedCargo);
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: "Erro ao atualizar cargo", error: error.message });
    }
  }
}

export default new CargoController();
