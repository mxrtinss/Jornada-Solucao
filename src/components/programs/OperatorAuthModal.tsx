import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, X, CheckCircle } from 'lucide-react';
import { Operator } from '../../types';
import { Button } from '../ui/Button';
import { apiService } from '../../services/apiService';

interface OperatorAuthModalProps {
  operator: Operator;
  onAuthenticate: (success: boolean) => void;
  onCancel: () => void;
  isVisible: boolean;
}

const OperatorAuthModal: React.FC<OperatorAuthModalProps> = ({
  operator,
  onAuthenticate,
  onCancel,
  isVisible
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
      setError('Por favor, insira a senha');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar senha usando a API
      const result = await apiService.verifyOperatorPassword(operator.matricula, password);
      
      if (result.success) {
        onAuthenticate(true);
      } else {
        setError('Senha incorreta');
        onAuthenticate(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao verificar senha. Tente novamente.');
      onAuthenticate(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError(null);
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-teal-600" />
            Autenticação do Operador
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Operador: {operator.nome}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Matrícula: {operator.matricula}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          Por favor, insira a senha do operador para confirmar a assinatura.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="operator-password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha do Operador
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="operator-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Digite a senha"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatorAuthModal; 