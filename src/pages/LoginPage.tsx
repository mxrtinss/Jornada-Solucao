import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserIcon, LockIcon, Loader2Icon, EyeIcon, EyeOffIcon, MonitorIcon } from 'lucide-react';
import { LogoIcon } from '../components/icons/LogoIcon';
import { InputField } from '../components/ui/InputField';
import { Dropdown } from '../components/ui/Dropdown';
import { Button } from '../components/ui/Button';
import { validateLoginForm } from '../utils/validation';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [machineId, setMachineId] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Machine options with MAC-XXX format
  const machineOptions = [
    { value: 'MAC-001', label: 'MAC-001' },
    { value: 'MAC-002', label: 'MAC-002' },
    { value: 'MAC-003', label: 'MAC-003' },
    { value: 'MAC-004', label: 'MAC-004' },
    { value: 'MAC-005', label: 'MAC-005' },
  ];
  
  const { login} = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extrair parâmetro de redirecionamento da URL
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateLoginForm(username, password, machineId);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Login logic with machine ID
      const success = await login(username, password, rememberMe, machineId);
      
      if (success) {
        showToast('Login realizado com sucesso', 'success');
        navigate(redirect);
      } else {
        showToast('Usuário ou senha inválidos', 'error');
      }
    } catch (error) {
      showToast('Ocorreu um erro durante o login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-4">
            <LogoIcon className="h-10 w-10 text-teal-700 mr-2" />
            <h1 className="text-2xl font-bold text-teal-800">Operações Industriais</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Bem-vindo de Volta</h2>
          <p className="text-gray-500">Entre na sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="username"
            label="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div className="relative">
            <InputField
              id="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
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

          <Dropdown
            id="machineId"
            label="Máquina"
            options={machineOptions}
            value={machineId}
            onChange={setMachineId}
            placeholder="Selecione a máquina"
            error={errors.machineId}
            required
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                Esqueceu a senha?
              </a>
            </div>
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Industrial Operations. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;




