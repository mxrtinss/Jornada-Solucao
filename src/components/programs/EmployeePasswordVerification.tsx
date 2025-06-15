import React, { useState } from 'react';
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { Button } from '../ui/Button';
import { verifyPassword } from '../../utils/passwordUtils';
import { Employee } from '../../types';

interface EmployeePasswordVerificationProps {
  employee: Employee;
  onVerify: (success: boolean) => void;
  onCancel: () => void;
  step: number;
  totalSteps: number;
}

const EmployeePasswordVerification: React.FC<EmployeePasswordVerificationProps> = ({
  employee,
  onVerify,
  onCancel,
  step,
  totalSteps
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Por favor, insira sua senha');
      return;
    }
    
    if (!employee.senha) {
      setError('Funcionário não possui senha cadastrada');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const isValid = await verifyPassword(password, employee.senha);
      if (isValid) {
        onVerify(true);
      } else {
        setError('Senha incorreta');
        onVerify(false);
      }
    } catch (error) {
      setError('Erro ao verificar senha');
      onVerify(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <LockIcon className="h-8 w-8 text-teal-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Verificação de Senha</h2>
          <p className="text-gray-600 mt-2">
            Por favor, insira sua senha para confirmar a conclusão do programa.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Operador {step} de {totalSteps}: {employee.nome}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <InputField
              id="employee-password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeePasswordVerification; 