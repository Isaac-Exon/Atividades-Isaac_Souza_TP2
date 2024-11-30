import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import routes from "./routes";
import Estudante from "./schemas/Estudante";
dotenv.config();

const uri = "mongodb://127.0.0.1:27017/escola";

function phoneMask(v: string | undefined): string | undefined {
  if (v === undefined) {
    return;
  }
  let r = v.replace(/\D/g, ""); // Remove caracteres não numéricos
  r = r.replace(/^0/, ""); // Remove o primeiro zero, caso exista
  if (r.length >= 11) {
    r = r.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3"); // Formato (XX) XXXXX-XXXX
  } else if (r.length > 7) {
    r = r.replace(/^(\d{2})(\d{5})(\d{0,5}).*/, "($1) $2-$3"); // Formato (XX) XXXXX-XXXX com até 5 dígitos
  } else if (r.length > 2) {
    r = r.replace(/^(\d{2})(\d{0,5})/, "($1) $2"); // Formato (XX) XXXXXX
  } else if (v.trim() !== "") {
    r = r.replace(/^(\d*)/, "($1"); // Formato (XX
  }
  return r;
}

export default function connect() {
  mongoose.connection.on("connected", () =>
    console.log("Conectado ao MongoDB")
  );
  mongoose.connection.on("open", () =>
    console.log("Conexão aberta com o MongoDB")
  );
  mongoose.connection.on("disconnected", () =>
    console.log("Desconectado do MongoDB")
  );
  mongoose.connection.on("reconnected", () =>
    console.log("Reconectado ao MongoDB")
  );
  mongoose.connection.on("disconnecting", () =>
    console.log("Desconectando do MongoDB")
  );
  mongoose.connection.on("close", () =>
    console.log("Conexão com o MongoDB fechada")
  );

  mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    })
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((e) => {
      console.error("Erro ao conectar ao MongoDB:", e.message);
    });

  process.on("SIGINT", async () => {
    try {
      console.log("Conexão com o MongoDB fechada");
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error("Erro ao fechar a conexão com o MongoDB:", error);
      process.exit(1);
    }
  });
}

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

connect();

interface Pessoa {
  nome: string;
  idade: number;
  email: string;
  telefone: string;
}

interface Estudante {
  ra: number;
  media: number;
  pessoa: string;
}

interface Disciplina {
  descricao: string;
  curso: string;
  semestre: number;
}

const persistirPessoa = async (pessoa: Pessoa) => {
  try {
    const response = await fetch("http://localhost:3001/pessoa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pessoa),
    });
    const data = await response.json();
    console.log("Pessoa criada:", data);
  } catch (error) {
    console.error("Erro ao criar pessoa:", error);
  }
};

const persistirEstudante = async (estudante: Estudante) => {
  try {
    const response = await fetch("http://localhost:3001/estudante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estudante),
    });
    const data = await response.json();
    console.log("Estudante criado:", data);
  } catch (error) {
    console.error("Erro ao criar estudante:", error);
  }
};

const persistirDisciplina = async (disciplina: Disciplina) => {
  try {
    const response = await fetch("http://localhost:3001/disciplina", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(disciplina),
    });
    const data = await response.json();
    console.log("Disciplina criada:", data);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
  }
};

const pessoas: Pessoa[] = [
  {
    nome: "Marcos_da_Silva",
    idade: 21,
    email: "marcos.silva@fatec.sp.gov.br",
    telefone: "12912343567",
  },
  {
    nome: "Ana_Maria_Brega",
    idade: 25,
    email: "ana.brega@fatec.sp.gov.br",
    telefone: "12999979999",
  },
  {
    nome: "Paulo_França",
    idade: 18,
    email: "paulo.fraca@fatec.sp.gov.br",
    telefone: "12999967999",
  },
  {
    nome: "Edson Arantes",
    idade: 30,
    email: "edson.arantes@gmail.sp.gov.br",
    telefone: "12999957999",
  },
];

const estudantes: Estudante[] = [
  { ra: 101010, media: 8.0, pessoa: "Marcos_da_Silva" },
  { ra: 100101, media: 9.5, pessoa: "Ana_Maria_Brega" },
  { ra: 111111, media: 7.0, pessoa: "Paulo_França" },
];

const disciplinas: Disciplina[] = [
  { descricao: "Técnicas de Programação I", curso: "DSM", semestre: 2 },
  { descricao: "Técnicas de Programação II", curso: "DSM", semestre: 3 },
  { descricao: "Banco de Dados Não Relacional", curso: "DSM", semestre: 3 },
  { descricao: "Programação Web I", curso: "DSM", semestre: 2 },
  { descricao: "Programação Web II", curso: "DSM", semestre: 3 },
];
for (let i = 0; i < 4; i++) {
  //persistirDisciplina(disciplinas[i]);
  //persistirPessoa(pessoas[i]);
  //persistirEstudante(estudantes[i]);
}

const buscarEstudantes = async () => {
  try {
    // Buscar estudantes e pessoas em paralelo
    const [estudantesResponse, pessoasResponse] = await Promise.all([
      fetch("http://localhost:3001/estudante", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch("http://localhost:3001/pessoa", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    if (!estudantesResponse.ok) throw new Error("Erro ao buscar estudantes");
    if (!pessoasResponse.ok) throw new Error("Erro ao buscar pessoas");

    const estudantes: Estudante[] = await estudantesResponse.json();
    const pessoas: Pessoa[] = await pessoasResponse.json();

    const pessoasMap = new Map(pessoas.map((pessoa) => [pessoa.nome, pessoa]));

    for (const estudante of estudantes) {
      const pessoa = pessoasMap.get(estudante.pessoa || "");

      console.log("<< Estudante >>");
      console.log(`RA: ${estudante.ra}`);
      console.log(`Nome: ${pessoa?.nome || "Não informado"}`);
      console.log(`Idade: ${pessoa?.idade || "Não informado"}`);
      console.log(`e-Mail: ${pessoa?.email || "Não informado"}`);
      console.log(
        `Telefone: ${phoneMask(pessoa?.telefone) || "Não informado"}`
      );
      console.log(`Média: ${estudante.media.toFixed(1)}`);
      console.log("--------------------");
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

buscarEstudantes();

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
