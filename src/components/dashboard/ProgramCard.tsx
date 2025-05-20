import React from 'react';
import { Program } from '../../types';

interface ProgramCardProps {
  program: Program;
  onClick: (programId: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer
        ${program.status === 'Refazer' ? 'border-l-4 border-red-500' : ''}`}
      onClick={() => onClick(program.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{program.programId}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          program.status === 'Em Andamento' 
            ? 'bg-blue-100 text-blue-800'
            : program.status === 'Refazer'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {program.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Material: {program.material}</p>
        {program.reference && <p>Ref: {program.reference}</p>}
        {program.machine && <p>Máquina: {program.machine}</p>}
      </div>
    </div>
  );
};

export default ProgramCard;
