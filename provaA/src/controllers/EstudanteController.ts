import { Request, Response } from "express";
import Estudante from "../schemas/Estudante";

class EstudanteController {
  public async create(req: Request, res: Response): Promise<any> {
    const { ra, media, pessoa } = req.body;
    try {
      const estudante = new Estudante({ ra, media, pessoa });
      const savedEstudante = await estudante.save();

      return res.json(savedEstudante);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        return res.status(400).json({ message: "Erro de validação", errors });
      }
      if (error.code === 11000 || error.code === 11001) {
        return res.json({ message: "Este RA já está em uso!" });
      }
      if (error && error.errors["ra"]) {
        return res.json({ message: error.errors["ra"].message });
      } else if (error && error.errors["media"]) {
        return res.json({ message: error.errors["media"].message });
      } else if (error && error.errors["pessoa"]) {
        return res.json({ message: error.errors["pessoa"].message });
      }
      return res.json({ message: error.message });
    }
  }

  public async list(_: Request, res: Response): Promise<any> {
    try {
      const estudantes = await Estudante.find().sort({ ra: "asc" });
      console.log("Estudantes encontrados:", estudantes);
      return res.json(estudantes);
    } catch (error: any) {
      console.error("Erro ao listar estudantes:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.body;
    try {
      const deletedEstudante = await Estudante.findByIdAndDelete(id);
      if (deletedEstudante) {
        return res.json({ message: "Estudante excluído com sucesso!" });
      } else {
        return res.json({ message: "Estudante inexistente!" });
      }
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { id, ra, media, pessoa } = req.body;
    try {
      const estudante = await Estudante.findById(id);
      if (!estudante) {
        return res.json({ message: "Estudante inexistente!" });
      }

      estudante.ra = ra;
      estudante.media = media;
      estudante.pessoa = pessoa;

      const updatedEstudante = await estudante.save();
      return res.json(updatedEstudante);
    } catch (error: any) {
      if (error.code === 11000 || error.code === 11001) {
        return res.json({ message: "Este RA já está em uso!" });
      } else if (error && error.errors["ra"]) {
        return res.json({ message: error.errors["ra"].message });
      } else if (error && error.errors["media"]) {
        return res.json({ message: error.errors["media"].message });
      } else if (error && error.errors["pessoa"]) {
        return res.json({ message: error.errors["pessoa"].message });
      }
      return res.json({ message: error.message });
    }
  }
}

export default new EstudanteController();
