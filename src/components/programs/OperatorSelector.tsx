import React, { useState, useEffect } from 'react';
import { User, Plus, X } from 'lucide-react';

// Tipo para representar um operador
interface Operator {
  id: string;
  matricula: string;
  nome: string;
}

// Tipo para as props do componente
interface OperatorSelectorProps {
  selectedOperators: Operator[];
  onOperatorsChange: (operators: Operator[]) => void;
}

// Lista simulada de operadores (em produção, isso viria de uma API)
const MOCK_OPERATORS: Operator[] = [
  { id: '1', matricula: '12345', nome: 'João Silva' },
  { id: '2', matricula: '23456', nome: 'Maria Oliveira' },
  { id: '3', matricula: '34567', nome: 'Pedro Santos' },
  { id: '4', matricula: '45678', nome: 'Ana Souza' },
  { id: '5', matricula: '56789', nome: 'Carlos Ferreira' },
  { id: '6', matricula: '67890', nome: 'Juliana Costa' },
  { id: '7', matricula: '78901', nome: 'Roberto Almeida' },
  { id: '8', matricula: '89012', nome: 'Fernanda Lima' },
];

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  selectedOperators = [],
  onOperatorsChange,
}) => {
  // Estado para controlar os operadores selecionados
  const [operators, setOperators] = useState<Operator[]>(selectedOperators);
  
  // Efeito para notificar o componente pai quando os operadores mudarem
  useEffect(() => {
    onOperatorsChange(operators);
  }, [operators, onOperatorsChange]);

  // Função para adicionar um operador vazio (para ser preenchido)
  const addEmptyOperator = () => {
    setOperators([...operators, { id: `temp-${Date.now()}`, matricula: '', nome: '' }]);
  };

  // Função para remover um operador
  const removeOperator = (index: number) => {
    const updatedOperators = [...operators];
    updatedOperators.splice(index, 1);
    setOperators(updatedOperators);
  };

  // Função para atualizar a matrícula de um operador
  const updateOperatorMatricula = (index: number, matricula: string) => {
    const updatedOperators = [...operators];
    updatedOperators[index].matricula = matricula;
    
    // Buscar o nome do operador com base na matrícula
    const foundOperator = MOCK_OPERATORS.find(op => op.matricula === matricula);
    if (foundOperator) {
      updatedOperators[index].nome = foundOperator.nome;
      updatedOperators[index].id = foundOperator.id;
    } else {
      updatedOperators[index].nome = '';
    }
    
    setOperators(updatedOperators);
  };

  // Função de validação para operadores
  const isOperatorValid = (operator: Operator): boolean => {
    return !!operator.matricula && !!operator.nome;
  };

  // Inicializar com um operador vazio se não houver nenhum
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
      
      {operators.map((operator, index) => (
        <div 
          key={operator.id} 
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
              {MOCK_OPERATORS.map((op) => (
                <option 
                  key={op.id} 
                  value={op.matricula}
                  // disabled={operators.some(
                  //   (selectedOp) => selectedOp.id === op.id && selectedOp.id !== operator.id
                  // )}
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


