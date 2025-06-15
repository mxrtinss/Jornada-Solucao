import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import { hashPassword } from '../../utils/passwordUtils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    matricula: '',
    nome: '',
    cargo: '',
    departamento: '',
    email: '',
    telefone: '',
    dataAdmissao: '',
    ativo: true,
    senha: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      const { _id, ...rest } = employee;
      setFormData(rest);
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validate passwords
    if (!employee && (!formData.senha || !confirmPassword)) {
      setError('Por favor, preencha a senha e confirmação');
      return;
    }

    if (formData.senha && formData.senha !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Hash password if it's being set or changed
      if (formData.senha) {
        const hashedPassword = await hashPassword(formData.senha);
        formData.senha = hashedPassword;
      }

      await onSubmit(formData);
    } catch (error) {
      setError('Erro ao salvar funcionário');
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matrícula */}
        <div>
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula
          </label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Cargo */}
        <div>
          <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Data de Admissão */}
        <div>
          <label htmlFor="dataAdmissao" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Admissão
          </label>
          <input
            type="date"
            id="dataAdmissao"
            name="dataAdmissao"
            value={formData.dataAdmissao}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="ativo" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="ativo"
            name="ativo"
            value={formData.ativo ? 'true' : 'false'}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isSubmitting}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            {employee ? 'Nova Senha (opcional)' : 'Senha'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required={!employee}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirmar Senha */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {employee ? 'Confirmar Nova Senha' : 'Confirmar Senha'}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required={!employee}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;


