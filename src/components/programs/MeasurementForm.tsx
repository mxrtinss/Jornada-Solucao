import React from 'react';
import { InfoIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface MeasurementFormProps {
  measurements: any[];
  onChange: (index: number, value: string) => void;
  measurementNotes: string;
  onNotesChange: (notes: string) => void;
  isVerified: boolean;
  onVerify: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  measurements, 
  onChange,
  measurementNotes, 
  onNotesChange,
  isVerified,
  onVerify
}) => {
  // Verificar se o campo de texto tem conteúdo
  const hasContent = measurementNotes && measurementNotes.trim().length > 0;
  
  return (
    <div className="space-y-4">
      {/* Renderização das medidas */}
      {measurements && measurements.length > 0 && (
        <div className="space-y-3">
          {measurements.map((measurement, index) => (
            <div key={index} className="flex flex-col">
              {/* Conteúdo das medidas */}
            </div>
          ))}
        </div>
      )}
      
      {/* Campo de notas de medição */}
      <div className={`border rounded-md p-4 ${isVerified ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start mb-3">
          <label htmlFor="measurementNotes" className="block text-sm font-medium text-gray-700">
            Verificação de Medidas
            <span className="text-red-500 ml-1">*</span>
          </label>
          {isVerified && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
        </div>
        
        <textarea
          id="measurementNotes"
          className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md text-sm"
          placeholder="Descreva aqui suas observações sobre a verificação de medidas..."
          value={measurementNotes}
          onChange={(e) => {
            console.log("Textarea alterado:", e.target.value);
            onNotesChange(e.target.value);
          }}
          required
        />
        
        <div className="mt-3 flex justify-end">
          <Button
            onClick={onVerify}
            disabled={!hasContent || isVerified}
            variant={isVerified ? "secondary" : "primary"}
            size="sm"
            leftIcon={isVerified ? <CheckCircleIcon className="h-4 w-4" /> : undefined}
          >
            {isVerified ? "Verificado" : "Confirmar Verificação"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;

