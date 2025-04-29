import React from 'react';
import { Program } from '../../types';

interface ProgramCardProps {
  program: Program;
  onClick: (programId: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(program.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{program.programId}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          program.status === 'Em Andamento' 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {program.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Máquina:</span>
          {program.machine}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Material:</span>
          {program.material}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="font-medium mr-2">Referência:</span>
          {program.reference}
        </div>
        
        {/* Seção de Comentários */}
        {program.comments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Comentários:</span>
              <span className="ml-2">{program.comments}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;