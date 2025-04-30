export interface ProgramParameters {
  rc: number;
  rib: number;
  alt: number;
  lat: number;
  vert: number;
  tempoTotal: string;
}

export interface ToolParameters {
  velocity: string;
  advance: string;
  depth: string;
  quality: {
    tolerance: string;
    finishing: string;
  };
}

export interface ToolDimensoes {
  "Ø": number;
  "RC": number;
  "Rib.": number;
  "Alt.": number;
  "Lat. 2D": number;
  "Sob. Esp.": number;
}

export interface Ferramenta {
  nome: string;
  dimensoes: ToolDimensoes;
}

export interface Tool {
  id: string;
  ferramenta: Ferramenta;
  type: string;
  function: string;
  parameters: ToolParameters;
}

export interface Program {
  id: string;
  programId: string;
  material: string;
  reference: string;
  machine: string;
  status: string;
  tools: Tool[];
  imagePath: string;
  measurements: any[];
  startTime: string | null;
  endTime: string | null;
  comments: string;
  processStartTime: string | null;
  processEndTime: string | null;
  signature: string;
  completedAt: string | null;
  date: string;
  programmer: string;
  center: string;
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

export interface ProgramStatusItem {
  programId: string;
  status: string;
  lastUpdated: string;
}

export interface Measurement {
  id: string;
  value: number;
  isVerified: boolean;
  notes?: string;
}








