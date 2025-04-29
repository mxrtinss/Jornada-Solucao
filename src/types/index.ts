export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface Program {
  id: string;
  programId: string;
  material: string;
  reference: string;
  machine: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  tools: Tool[];
  imagePath: string;
  measurements: Measurement[];
  startTime: string | null;
  endTime: string | null;
  comments: string;
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  function: string;
}

export interface Measurement {
  id: string;
  value: number;
  description: string;
  timestamp: string;
}

export interface ProgramStatusItem {
  programId: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  lastUpdated: string;
}

export interface DashboardData {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  activePrograms: Program[];
}







