import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Program } from '../../types';

interface RecentCompletionsProps {
  program: Program;
  onClose: () => void;
}

const RecentCompletions: React.FC<RecentCompletionsProps> = ({ program, onClose }) => {
  return (
    <div className="fixed right-4 top-20 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80 border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
            <div>
              <h4 className="font-medium text-gray-900">Programa Concluído</h4>
              <p className="text-sm text-gray-600">
                {program.programName} - {program.programId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Máquina: {program.machine}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentCompletions;