import React from 'react';
import { Program } from '../../types';
import { FileText, CheckCircle } from 'lucide-react';

interface CompletedProgramListProps {
  programs: Program[];
  onProgramClick: (programId: string) => void;
}

const CompletedProgramList: React.FC<CompletedProgramListProps> = ({ programs, onProgramClick }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Programas Concluídos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div
            key={program.id}
            onClick={() => onProgramClick(program.id)}
            className="relative p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
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
              {program.completedAt && (
                <p className="text-sm text-gray-600">Concluído em: {new Date(program.completedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedProgramList;