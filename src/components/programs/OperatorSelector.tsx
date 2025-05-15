import React, { useState, useEffect } from 'react';
import { User, Plus, X } from 'lucide-react';
import { useMongoCollection } from '../../hooks/useMongoCollection';
import { Operator } from '../../types';

// Type for the props of the component
interface OperatorSelectorProps {
  selectedOperators: Operator[];
  onOperatorsChange: (operators: Operator[]) => void;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  selectedOperators = [],
  onOperatorsChange,
}) => {
  // Use our custom hook to get operators from MongoDB (funcionarios collection) with real-time updates
  const { data: availableOperators, loading, error } = useMongoCollection<Operator>('funcionarios');
  
  // State for selected operators
  const [operators, setOperators] = useState<Operator[]>(selectedOperators);
  
  // Effect to notify parent component when operators change
  useEffect(() => {
    onOperatorsChange(operators);
  }, [operators, onOperatorsChange]);

  // Function to add an empty operator (to be filled)
  const addEmptyOperator = () => {
    setOperators([...operators, { matricula: '', nome: '' }]);
  };

  // Function to remove an operator
  const removeOperator = (index: number) => {
    const updatedOperators = [...operators];
    updatedOperators.splice(index, 1);
    setOperators(updatedOperators);
  };

  // Function to update an operator's matricula
  const updateOperatorMatricula = (index: number, matricula: string) => {
    const updatedOperators = [...operators];
    updatedOperators[index].matricula = matricula;
    
    // Find the operator with the matching matricula
    const foundOperator = availableOperators?.find(op => op.matricula === matricula);
    if (foundOperator) {
      updatedOperators[index] = {
        ...foundOperator,
        // Ensure we use MongoDB _id as our id
        id: foundOperator._id
      };
    } else {
      updatedOperators[index].nome = '';
    }
    
    setOperators(updatedOperators);
  };

  // Function to validate operators
  const isOperatorValid = (operator: Operator): boolean => {
    return !!operator.matricula && !!operator.nome;
  };

  // Initialize with an empty operator if none exist
  useEffect(() => {
    if (operators.length === 0) {
      addEmptyOperator();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <User className="h-5 w-5 mr-2 text-teal-700" />
        <h3 className="text-lg font-semibold text-gray-800">Operadores</h3>
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-teal-500 border-r-2 border-teal-500 border-b-2 border-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando operadores...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Erro ao carregar operadores: {error.message}</p>
        </div>
      )}
      
      {!loading && !error && operators.map((operator, index) => (
        <div 
          key={operator._id || `temp-${index}`} 
          className={`flex flex-col space-y-2 p-3 border rounded-lg bg-white ${
            operator.matricula ? 
              (isOperatorValid(operator) ? 'border-green-200' : 'border-red-200') : 
              'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <label htmlFor={`operator-${index}`} className="text-sm font-medium text-gray-600">
              Matrícula do Operador
            </label>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeOperator(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <select
              id={`operator-${index}`}
              value={operator.matricula}
              onChange={(e) => updateOperatorMatricula(index, e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${
                operator.matricula && !isOperatorValid(operator) ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma matrícula</option>
              {availableOperators?.map((op) => (
                <option 
                  key={op._id} 
                  value={op.matricula}
                >
                  {op.matricula}
                </option>
              ))}
            </select>
            
            {operator.nome && (
              <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                <span className="font-medium">Nome:</span> {operator.nome}
              </div>
            )}
            
            {operator.matricula && !operator.nome && (
              <div className="text-sm text-red-500">
                Matrícula inválida ou não encontrada
              </div>
            )}
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addEmptyOperator}
        className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-teal-600 hover:border-teal-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        Adicionar Operador
      </button>
    </div>
  );
};

export default OperatorSelector;




