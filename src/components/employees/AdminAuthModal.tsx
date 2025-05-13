import React, { useState } from 'react';
import { X, LockIcon, UserIcon, Loader2Icon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { Button } from '../ui/Button';

interface AdminAuthModalProps {
  onAuthenticate: (success: boolean) => void;
  onCancel: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onAuthenticate, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulando verificação de credenciais de administrador
      // Em produção, isso seria uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aceita qualquer usuário e senha para facilitar testes
      // Em produção, isso seria validado no servidor
      onAuthenticate(true);
    } catch (error) {
      setError('Erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Acesso Administrativo</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Esta área é restrita. Por favor, entre com suas credenciais de administrador.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="admin-username"
            label="Usuário Admin"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div className="relative">
            <InputField
              id="admin-password"
              label="Senha Admin"
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
              {isLoading ? (
                <>
                  <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acessar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthModal;
