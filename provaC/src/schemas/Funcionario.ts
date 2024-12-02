import mongoose from "mongoose";
const { Schema } = mongoose;

// Lista de DDDs válidos
const validDDDs = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
];

// Schema do Funcionário com validações
const FuncionarioSchema = new Schema({
  nome: { type: String, maxlength: 50, required: true },
  idade: { type: Number, min: 0, required: true },
  email: {
    type: String,
    maxlength: 100,
    required: true,
    validate: [
      {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "O e-mail deve ser válido e conter '@' e '.'",
      },
      {
        validator: (value: string) =>
          /@(adm|fiscal|dev)\.xpto\.tec\.br$/.test(value),
        message: "O e-mail deve pertencer aos domínios permitidos da empresa",
      },
    ],
  },
  fone: {
    type: String,
    maxlength: 11,
    required: true,
    validate: [
      {
        validator: (value: string) => /^[0-9]{10,11}$/.test(value),
        message: "O número de telefone deve ter entre 10 e 11 dígitos",
      },
      {
        validator: (value: string) => {
          const ddd = parseInt(value.substring(0, 2));
          return validDDDs.includes(ddd);
        },
        message: "O DDD do telefone não é válido",
      },
    ],
  },
});

export default mongoose.model("Funcionario", FuncionarioSchema);
