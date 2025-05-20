import React, { useState } from 'react';
import { LockIcon, KeyIcon, Loader2Icon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';

const WeekendLockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { unlockWeekend } = useAuth();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Por favor, insira a senha');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simular um pequeno atraso para verificação
    setTimeout(() => {
      const success = unlockWeekend(password);
      
      if (!success) {
        setError('Senha incorreta');
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <LockIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sistema Indisponível</h1>
          <p className="text-gray-600 mt-2">
            O sistema está bloqueado durante o final de semana.
            <br />
            Por favor, insira a senha de acesso para continuar.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <InputField
              id="unlock-password"
              label="Senha de Acesso"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
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
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              'Desbloquear Acesso'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Para acesso de emergência, contate o administrador do sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default WeekendLockScreen;