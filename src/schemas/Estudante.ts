import mongoose from "mongoose";
import { Schema } from "mongoose";
import Pessoa from "./Pessoa";

const EstudanteSchema = new Schema({
    ra: { type: Number, max: 9999999999 },
    media: { type: Number, required: true },
    pessoa: {
        type: String, ref: "Pessoa", required: true, validate: {
            validator: async function (value: string) {
                const pessoa = await Pessoa.findOne({ nome: value });
                return !!pessoa;
            },
            message: "O nome fornecido para a pessoa não corresponde a um registro existente."
        },
    },
});

export default mongoose.model("Estudante", EstudanteSchema);