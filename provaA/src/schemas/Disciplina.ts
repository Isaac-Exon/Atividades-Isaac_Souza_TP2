import mongoose from "mongoose";
import { Schema } from "mongoose";

const DisciplinaSchema = new Schema ({
    descricao: {type: String, maxlength: 60, required: true},
    curso: {type: String, maxlength: 45, required: true},
    semestre: {type: Number, min: 1, max: 12, required: true}
});

export default mongoose.model("Disciplina", DisciplinaSchema);