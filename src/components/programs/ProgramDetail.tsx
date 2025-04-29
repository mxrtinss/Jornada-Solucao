import React, { useState } from 'react';
import { Program } from '../../types';
import MeasurementVerification from './MeasurementVerification';

interface ProgramDetailProps {
  program: Program;
  onUpdate: (program: Program) => void;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onUpdate }) => {
  const [measurementNotes, setMeasurementNotes] = useState(program.measurementVerification || '');

  const handleMeasurementChange = (value: string) => {
    setMeasurementNotes(value);
    onUpdate({
      ...program,
      measurementVerification: value
    });
  };

  const canComplete = () => {
    return measurementNotes.trim().length > 0;
  };

  return (
    <div className="space-y-4">
      {/* Outros componentes */}
      
      <MeasurementVerification
        value={measurementNotes}
        onChange={handleMeasurementChange}
      />

      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            canComplete()
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canComplete()}
          onClick={() => {/* lógica de conclusão */}}
        >
          Concluir Programa
        </button>
      </div>
    </div>
  );
};

export default ProgramDetail;