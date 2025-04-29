import React from 'react';

interface MeasurementVerificationProps {
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
}

const MeasurementVerification: React.FC<MeasurementVerificationProps> = ({
  value,
  onChange,
  isRequired = true
}) => {
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="mb-2">
        <label htmlFor="measurementNotes" className="block text-sm font-medium text-gray-700">
          Verificação de Medidas {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      <textarea
        id="measurementNotes"
        className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md text-sm"
        placeholder="Descreva aqui as verificações de medidas realizadas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={isRequired}
      />
    </div>
  );
};

export default MeasurementVerification;