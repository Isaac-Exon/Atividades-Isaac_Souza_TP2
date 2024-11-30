export default class Pessoa {
    id?: string;
    nome: string;
    idade: number;
    email: string;
    telefone: string;
    
    constructor(nome: string, idade: number, email: string, telefone: string){
        this.nome = nome;
        this.idade = idade;
        this.email = email;
        this.telefone = telefone;
    };
};