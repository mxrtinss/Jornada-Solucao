import { Program, DashboardData } from '../types';

const mockPrograms: Program[] = [
  {
    id: '1',
    programId: 'PRG001',
    material: '1731',
    reference: 'EM Z: 20,0',
    machine: 'F1400',
    status: 'Em Andamento',
    tools: [
      {
        id: '1',
        ferramenta: {
          nome: 'BK_TOPDRIL_D44_SSD_701800022',
          dimensoes: {
            "Ø": 48,
            "RC": 247,
            "Rib.": 273,
            "Alt.": 0,
            "Lat. 2D": 0,
            "Sob. Esp.": 3
          }
        },
        type: 'Corte',
        function: 'Desbaste',
        parameters: {
          velocity: '1000 rpm',
          advance: '0.2 mm/rev',
          depth: '2.5 mm',
          quality: {
            tolerance: '±0.02 mm',
            finishing: 'Ra 1.6'
          }
        }
      },
    ],
    imagePath: '/images/program09.png',
    measurements: [],
    startTime: new Date().toISOString(),
    endTime: null,
    comments: 'Verificar alinhamento antes de iniciar',
    processStartTime: null,
    processEndTime: null,
    signature: '',
    completedAt: null,
    date: '2024-01-20',
    programmer: 'diego.vericiano',
    center: 'Centro 1'
  },
  {
    id: '2',
    programId: 'PRG002',
    material: '1730',
    reference: 'EM Z: 20,0',
    machine: 'F1400',
    status: 'Pendente',
    tools: [
      {
        id: '4',
        ferramenta: {
          nome: 'BK_TOPDRIL_D44_SSD_701800011',
          dimensoes: {
            "Ø": 48,
            "RC": 247,
            "Rib.": 273,
            "Alt.": 0,
            "Lat. 2D": 0,
            "Sob. Esp.": 3
          }
        },
        type: 'Furação',
        function: 'Centro',
        parameters: {
          velocity: '2400 RPM',
          advance: '0.15 mm/rev',
          depth: '120 mm',
          quality: {
            tolerance: '±0.008 mm',
            finishing: 'Ra 0.2'
          }
        }
      }
    ],
    imagePath: '/images/program09.png',
    measurements: [],
    startTime: null,
    endTime: null,
    comments: 'Verificar alinhamento antes de iniciar',
    processStartTime: null,
    processEndTime: null,
    signature: '',
    completedAt: null,
    date: '2025-02-10',
    programmer: 'diego.verciano',
    center: 'X0,0 Y0,0'
  }
];

export const getPrograms = async (): Promise<Program[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrograms);
    }, 1000);
  });
};

export const getProgram = async (id: string): Promise<Program> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const program = mockPrograms.find(p => p.id === id);
      
      if (!program) {
        reject(new Error('Programa não encontrado'));
        return;
      }

      console.log('Programa encontrado no service:', program);
      console.log('Comentários no service:', program.comments);

      resolve(program);
    }, 500);
  });
};

export const completeProgram = async (
  id: string, 
  payload: {
    processStartTime: string | null;
    processEndTime: string | null;
    measurements: any[];
    signature: string;
    comments: string;
  }
): Promise<Program> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const programIndex = mockPrograms.findIndex(p => p.id === id);
      
      if (programIndex === -1) {
        reject(new Error('Programa não encontrado'));
        return;
      }

      // Atualiza o programa atual para concluído
      mockPrograms[programIndex] = {
        ...mockPrograms[programIndex],
        status: 'Concluído',
        processStartTime: payload.processStartTime,
        processEndTime: payload.processEndTime,
        measurements: payload.measurements,
        signature: payload.signature,
        comments: payload.comments,
        completedAt: new Date().toISOString()
      };

      // Procura o próximo programa pendente
      const nextPendingProgram = mockPrograms.find(p => p.status === 'Pendente');
      if (nextPendingProgram) {
        const nextProgramIndex = mockPrograms.findIndex(p => p.id === nextPendingProgram.id);
        mockPrograms[nextProgramIndex] = {
          ...mockPrograms[nextProgramIndex],
          status: 'Em Andamento',
          startTime: new Date().toISOString()
        };
      }

      resolve(mockPrograms[programIndex]);
    }, 500);
  });
};

export const updateProgramStatus = async (id: string, status: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const programIndex = mockPrograms.findIndex(p => p.id === id);
      
      if (programIndex === -1) {
        reject(new Error('Programa não encontrado'));
        return;
      }

      mockPrograms[programIndex] = {
        ...mockPrograms[programIndex],
        status
      };

      resolve();
    }, 500);
  });
};

export const getDashboardData = async (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          total: mockPrograms.length,
          completed: mockPrograms.filter(p => p.status === 'Concluído').length,
          inProgress: mockPrograms.filter(p => p.status === 'Em Andamento').length,
          pending: mockPrograms.filter(p => p.status === 'Pendente').length,
        },
        activePrograms: mockPrograms.filter(p => p.status !== 'Concluído'),
      });
    }, 1000);
  });
};







