// Definição de tipos para o sistema

// Tipo para usuário autenticado
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Tipo para funcionário
export interface Employee {
  id: string;
  matricula: string;
  nome: string;
  senha?: string;
}

// Alias para compatibilidade com código existente
export type Operator = Employee;

export interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  verified: boolean;
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  startDate: string;
  endDate?: string;
  operators: Operator[];
  measurements: Measurement[];
  notes?: string;
  measurementNotes?: string;
  timeTracking?: {
    startTime: string;
    endTime?: string;
    totalTime?: number;
  };
  digitalSignature?: {
    signature: string;
    timestamp: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'in_use' | 'maintenance';
  lastCalibration?: string;
  nextCalibration?: string;
}

export interface ProgramStatusItem {
  id: string;
  programId: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp: string;
  notes?: string;
}

