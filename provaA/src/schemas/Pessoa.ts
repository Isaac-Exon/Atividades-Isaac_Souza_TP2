import mongoose from "mongoose";
import { Schema } from "mongoose";

const ddds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42,
    43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75,
    77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99
]

const PessoaSchema = new Schema({
    nome: { type: String, maxlength: 50, required: true },
    idade: { type: Number, min: 14, max: 120, required: true },
    email: {
        type: String, maxlength: 100, required: true, unique: true, validate: {
            validator: (value: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return false;

                const allowedDomains = ["@etec.sp.gov.br", "@fatec.sp.gov.br", "@cps.sp.gov.br"];
                return allowedDomains.some((domain) => value.endsWith(domain));
            },
            message: "E-mail inválido! use um e-mail de domínio @etec.sp.gov.br, @fatec.sp.gov.br ou @cps.sp.gov.br.",
        },
    },
    telefone: {
        type: String, maxlength: 11, required: true, validate: {
            validator: (value: string) => {
                const telefoneRegex = /^[0-9]{10,11}$/;
                if (!telefoneRegex.test(value)) return false;

                const ddd = parseInt(value.slice(0, 2), 10);
                return ddds.includes(ddd);
            },
            message: "Telefone inválido! Certifique-se de que o numero está no formato correto e possui um DDD válido",
        },
    },
});

export default mongoose.model("Pessoa", PessoaSchema);