import React, { useState, useEffect } from 'react';
import { User, Plus, X } from 'lucide-react';
import { useMongoCollection } from '../../hooks/useMongoCollection';
import { Operator } from '../../types';
import OperatorAuthModal from './OperatorAuthModal';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentOperatorIndex, setCurrentOperatorIndex] = useState<number | null>(null);
  const [authenticatedOperators, setAuthenticatedOperators] = useState<string[]>([]); // lista de matrículas autenticadas
  const [failedAuthOperators, setFailedAuthOperators] = useState<string[]>([]); // lista de matrículas com falha na autenticação
  
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
    updatedOperators[index] = {
      ...updatedOperators[index],
      matricula,
      nome: availableOperators?.find(op => op.matricula === matricula)?.nome || ''
    };
    setOperators(updatedOperators);
    
    // Se uma matrícula foi selecionada E (o operador ainda não foi autenticado OU falhou na autenticação), abrir modal
    if (matricula && (!authenticatedOperators.includes(matricula) || failedAuthOperators.includes(matricula))) {
      setCurrentOperatorIndex(index);
      setShowAuthModal(true);
    }
  };

  // Função para reautenticar um operador (quando clica na matrícula de um que falhou)
  const handleReauthenticate = (index: number) => {
    if (operators[index].matricula) {
      setCurrentOperatorIndex(index);
      setShowAuthModal(true);
    }
  };

  // Função chamada após autenticação
  const handleAuthSuccess = (success: boolean) => {
    if (success && currentOperatorIndex !== null) {
      setAuthenticatedOperators(prev => [...prev, operators[currentOperatorIndex].matricula]);
      setFailedAuthOperators(prev => prev.filter(m => m !== operators[currentOperatorIndex].matricula));
    } else if (!success && currentOperatorIndex !== null) {
      setFailedAuthOperators(prev => [...prev, operators[currentOperatorIndex].matricula]);
    }
    setShowAuthModal(false);
    setCurrentOperatorIndex(null);
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
              (authenticatedOperators.includes(operator.matricula) ? 'border-green-200' : 
               failedAuthOperators.includes(operator.matricula) ? 'border-red-200' : 'border-yellow-200') : 
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
                operator.matricula && !authenticatedOperators.includes(operator.matricula) ? 'border-red-300' : 'border-gray-300'
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
            
            {/* Indicação de autenticado */}
            {operator.matricula && authenticatedOperators.includes(operator.matricula) && (
              <div className="text-xs text-green-600">✅ Operador autenticado</div>
            )}
            
            {/* Aviso de senha incorreta com opção de tentar novamente */}
            {operator.matricula && failedAuthOperators.includes(operator.matricula) && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                ❌ Senha incorreta. 
                <button 
                  type="button"
                  onClick={() => handleReauthenticate(index)}
                  className="ml-1 underline hover:no-underline font-medium"
                >
                  Clique aqui para tentar novamente
                </button>
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
      {/* Modal de autenticação de senha */}
      {showAuthModal && currentOperatorIndex !== null && (
        <OperatorAuthModal
          operator={operators[currentOperatorIndex]}
          onAuthenticate={handleAuthSuccess}
          onCancel={() => { setShowAuthModal(false); setCurrentOperatorIndex(null); }}
          isVisible={showAuthModal}
        />
      )}
    </div>
  );
};

export default OperatorSelector;




