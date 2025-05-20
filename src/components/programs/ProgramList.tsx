import React from 'react';
import { Program } from '../../types';
import { FileText, Clock, CheckCircle, Circle, RefreshCw } from 'lucide-react';

interface ProgramListProps {
  programs: Program[];
  onProgramClick: (programId: string) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, onProgramClick }) => {
  const getStatusIcon = (status: Program['status']) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Em Andamento':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Pendente':
        return <Circle className="w-5 h-5 text-amber-500" />;
      case 'Refazer':
        return <RefreshCw className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Função para ordenar os programas
  const sortPrograms = (a: Program, b: Program) => {
    // Ordem de prioridade: Em Andamento > Pendente > Refazer
    const statusOrder = {
      'Em Andamento': 1,
      'Pendente': 2,
      'Refazer': 3,
      'Concluído': 4
    };
    
    // Comparar por status primeiro
    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
    if (statusComparison !== 0) return statusComparison;
    
    // Se o status for o mesmo, ordenar por ID do programa
    return a.programId.localeCompare(b.programId);
  };

  // Ordenar os programas
  const sortedPrograms = [...programs].sort(sortPrograms);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Programas Ativos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedPrograms.map((program) => (
          <div
            key={program.id}
            onClick={() => program.status !== 'Concluído' && onProgramClick(program.id)}
            className={`relative p-4 bg-white rounded-lg shadow transition-shadow
              ${program.status === 'Concluído' 
                ? 'opacity-60 cursor-not-allowed' 
                : 'cursor-pointer hover:shadow-md'}
              ${program.status === 'Refazer' ? 'border-l-4 border-red-500' : ''}`}
          >
            {/* Ícone de Status no canto superior direito */}
            <div className="absolute top-4 right-4">
              {getStatusIcon(program.status)}
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Programa {program.programId}</span>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">Material: {program.material}</p>
              {program.reference && (
                <p className="text-sm text-gray-600">Ref: {program.reference}</p>
              )}
              {program.machine && (
                <p className="text-sm text-gray-600">Máquina: {program.machine}</p>
              )}
            </div>
            
            {program.status === 'Concluído' && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  Programa Concluído
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;







