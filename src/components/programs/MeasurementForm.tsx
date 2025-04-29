import React from 'react';
import { InfoIcon } from 'lucide-react';

interface MeasurementFormProps {
  measurementNotes: string;
  onNotesChange: (notes: string) => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  measurementNotes, 
  onNotesChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4">
        <div className="flex justify-between items-start mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Verificação de Medidas
            <span className="text-red-500 ml-1">*</span>
          </label>
          <InfoIcon className="h-4 w-4 text-gray-400" />
        </div>
        
        <textarea
          className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Descreva aqui suas observações sobre a verificação de medidas..."
          value={measurementNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default MeasurementForm;

