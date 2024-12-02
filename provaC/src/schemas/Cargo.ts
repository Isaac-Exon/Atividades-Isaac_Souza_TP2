import mongoose, { Schema } from "mongoose";

const CargoSchema = new Schema({
  cbo: {
    type: String,
    required: true,
    maxlength: 7,
    validate: {
      validator: (v: string): boolean => /^[0-9]{4}-[0-9]{2}$/.test(v),
      message: (props: { value: string }) =>
        `${props.value} não está no formato válido (9999-99).`,
    },
  },
  descricao: { type: String, maxlength: 45, required: true },
});

export default mongoose.model("Cargo", CargoSchema);
