import mongoose, { Schema } from "mongoose";

const MensalistaSchema = new Schema({
  matricula: { type: Number, required: true },
  salario: { type: Number, required: true },
  funcionario: {
    type: String, // Alterado para armazenar o nome do funcionário
    required: true,
  },
});

export default mongoose.model("Mensalista", MensalistaSchema);
