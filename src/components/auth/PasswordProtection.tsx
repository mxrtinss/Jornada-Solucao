import React, { useState } from 'react';

interface PasswordProtectionProps {
  onAuthenticate: (isAuthenticated: boolean) => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Para teste, a senha é "admin123"
    if (password === 'admin123') {
      onAuthenticate(true);
      setError('');
    } else {
      setError('Senha incorreta');
      onAuthenticate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Área Restrita</h2>
        <p className="text-gray-600 mb-4">
          Por favor, insira a senha para acessar a área de funcionários.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection; 