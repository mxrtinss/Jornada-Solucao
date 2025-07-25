// Definição de tipos para o sistema

// Tipo para usuário autenticado
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Tipo para funcionário
export interface Operator {
  _id?: string;  // Optional for new employees, required for existing ones
  matricula: string;
  nome: string;
  cargo?: string;
  departamento?: string;
  email?: string;
  telefone?: string;
  dataAdmissao?: string;
  ativo?: boolean;
  senha?: string; // Senha para autenticação individual
}

// Tipo para programa
export interface Program {
  id: string;
  programId: string;
  programName?: string;
  material: string;
  reference?: string;
  machine?: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Refazer';
  // Outros campos...
}

