export default class Mensalista {
  id?: string;
  matricula: string;
  salario: number;
  funcionario: string;

  constructor(matricula: string, salario: number, funcionario: string) {
    this.matricula = matricula;
    this.salario = salario;
    this.funcionario = funcionario;
  }
}
