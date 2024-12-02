import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import routes from "./routes";

dotenv.config();

const uri = "mongodb://127.0.0.1:27017/empresa";
function phoneMask(v: string | undefined) {
  if (v == undefined) {
    return;
  }
  let r = v.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length >= 11) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 7) {
    r = r.replace(/^(\d\d)(\d{5})(\d{0,5}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else if (v.trim() !== "") {
    r = r.replace(/^(\d*)/, "($1");
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

interface Funcionario {
  nome: string;
  idade: number;
  email: string;
  fone: string;
}

interface Mensalista {
  matricula: number;
  salario: number;
  funcionario: string;
}

interface Cargo {
  descricao: string;
  cbo: string;
}

const persistirFuncionario = async (pessoa: Funcionario) => {
  try {
    const response = await fetch("http://localhost:3001/funcionario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pessoa),
    });
    const data = await response.json();
    console.log("funcionario criado :", data);
  } catch (error) {
    console.error("Erro ao criar funcionario:", error);
  }
};

const persistirMensalista = async (mensalista: Mensalista) => {
  try {
    const response = await fetch("http://localhost:3001/mensalista", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mensalista),
    });
    const data = await response.json();
    console.log("Mensalista criado:", data);
  } catch (error) {
    console.error("Erro ao criar mensalist:", error);
  }
};

const persistirCargo = async (disciplina: Cargo) => {
  try {
    const response = await fetch("http://localhost:3001/cargo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(disciplina),
    });
    const data = await response.json();
    console.log("Cargo  criado:", data);
  } catch (error) {
    console.error("Erro ao criar criado:", error);
  }
};

const funcionarios: Funcionario[] = [
  {
    nome: "Marcos_da_Silva",
    idade: 21,
    email: "marcos.silva@dev.xpto.tec.br",
    fone: "12912343567",
  },
  {
    nome: "Ana_Maria_Brega",
    idade: 25,
    email: "ana.brega@adm.xpto.tec.br",
    fone: "12999979999",
  },
  {
    nome: "Paulo_França",
    idade: 18,
    email: "paulo.fraca@fiscal.xpto.tec.br",
    fone: "12999967999",
  },
  {
    nome: "Edson Arantes",
    idade: 30,
    email: "edson.arantes@gmail.xpto.tec.br",
    fone: "12999957999",
  },
];

const mensalista: Mensalista[] = [
  { matricula: 1234567891, salario: 5000, funcionario: "Marcos_da_Silva" },
  { matricula: 1212121212, salario: 3512.15, funcionario: "Ana_Maria_Brega" },
  { matricula: 2121212121, salario: 2521.54, funcionario: "Paulo_França" },
];

const cargos: Cargo[] = [
  { descricao: "Analista Fiscal", cbo: "25112-25" },
  { descricao: "Programador", cbo: "3171-05" },
  { descricao: "Desenvolvedor", cbo: "3171-05" },
  { descricao: "Técnico de Informática", cbo: "3132-20" },
];
for (let i = 0; i < 4; i++) {
  //persistirMensalista(mensalista[i]);
  //persistirFuncionario(funcionarios[i]);
  //persistirCargo(cargos[i]);
}

const buscarFuncionario = async () => {
  try {
    const [mensalistaResponse, funcionarioResponse] = await Promise.all([
      fetch("http://localhost:3001/mensalista", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch("http://localhost:3001/funcionario", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    if (!mensalistaResponse.ok) throw new Error("Erro ao buscar mensalista");
    if (!funcionarioResponse.ok) throw new Error("Erro ao buscar funcionário");

    const mensalistas: any[] = await mensalistaResponse.json();
    const funcionarios: any[] = await funcionarioResponse.json();

    const funcionarioMap = new Map(
      funcionarios.map((funcionario) => [funcionario.nome, funcionario])
    );

    for (const mensalista of mensalistas) {
      const funcionario = funcionarioMap.get(mensalista.funcionario);

      console.log("<< Mensalista >>");
      console.log(`Matrícula: ${mensalista.matricula}`);
      console.log(
        `Nome: ${funcionario?.nome.replace(/_/g, " ") || "Não informado"}`
      );
      console.log(`Idade: ${funcionario?.idade || "Não informado"}`);
      console.log(`e-Mail: ${funcionario?.email || "Não informado"}`);
      console.log(
        `Telefone: ${phoneMask(funcionario?.fone) || "Não informado"}`
      );
      console.log(
        `Salário: R$ ${mensalista.salario.toFixed(2).replace(".", ",")}`
      );
      console.log("--------------------");
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

buscarFuncionario();

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
