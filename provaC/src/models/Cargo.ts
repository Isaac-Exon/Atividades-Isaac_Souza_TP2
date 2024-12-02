export default class Cargo {
  id?: string;
  cbo: string;
  descricao: string;

  constructor(cbo: string, descricao: string) {
    this.cbo = cbo;
    this.descricao = descricao;
  }
}
