import React, { useState, useEffect } from 'react';
import { Operator as Employee } from '../../types/index';
import { X } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (employee: Omit<Employee, '_id'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Omit<Employee, '_id'>>({
    matricula: '',
    nome: '',
    cargo: '',
    departamento: '',
    email: '',
    telefone: '',
    dataAdmissao: '',
    ativo: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {/* Status (Ativo/Inativo) */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
              Funcionário Ativo
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Salvando...' 
              : (employee ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;


