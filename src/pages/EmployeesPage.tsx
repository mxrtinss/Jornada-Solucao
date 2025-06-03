import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMongoCollection } from '../hooks/useMongoCollection';
import { Employee } from '../services/apiService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmployeeForm from '../components/employees/EmployeeForm';
import { apiService } from '../services/apiService';

function EmployeesPage() {
  const { data: employees, loading, error, refreshData } = useMongoCollection<Employee>('funcionarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.matricula.includes(searchTerm) ||
    (employee.cargo && employee.cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.departamento && employee.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (employee: Employee) => {
    if (!employee._id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o funcionário ${employee.nome}?`)) {
      try {
        await apiService.deleteFuncionario(employee._id);
        refreshData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Erro ao excluir funcionário');
      }
    }
  };

  const handleFormSubmit = async (formData: Partial<Employee>) => {
    try {
      if (selectedEmployee?._id) {
        // Update existing employee
        await apiService.updateFuncionario(selectedEmployee._id, formData);
      } else {
        // Create new employee - ensure required fields are present
        if (!formData.matricula || !formData.nome) {
          alert('Matrícula e nome são obrigatórios');
          return;
        }
        
        // Prepare the new employee data with default values
        const newEmployee = {
          matricula: formData.matricula,
          nome: formData.nome,
          cargo: formData.cargo || '',
          departamento: formData.departamento || '',
          email: formData.email || '',
          telefone: formData.telefone || '',
          dataAdmissao: formData.dataAdmissao || new Date().toISOString().split('T')[0],
          ativo: formData.ativo !== undefined ? formData.ativo : true
        };

        console.log('Creating new employee:', newEmployee);
        await apiService.addFuncionario(newEmployee);
      }
      refreshData();
      setIsFormOpen(false);
      setSelectedEmployee(undefined);
    } catch (error) {
      console.error('Error saving employee:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar funcionário');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleAdd = () => {
    setSelectedEmployee(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Funcionários</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleAdd}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar
          </button>
          <button 
            onClick={refreshData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar funcionário..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingState message="Carregando funcionários..." />
      ) : error ? (
        <ErrorState 
          message={`Erro ao carregar funcionários: ${error.message}`} 
          onRetry={refreshData} 
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Matrícula</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">Cargo</th>
                <th className="py-2 px-4 border-b">Departamento</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Nenhum funcionário encontrado
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="py-2 px-4 border-b">{employee.matricula}</td>
                    <td className="py-2 px-4 border-b">{employee.nome}</td>
                    <td className="py-2 px-4 border-b">{employee.cargo || '-'}</td>
                    <td className="py-2 px-4 border-b">{employee.departamento || '-'}</td>
                    <td className="py-2 px-4 border-b">{employee.email || '-'}</td>
                    <td className="py-2 px-4 border-b">{employee.telefone || '-'}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${employee.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(employee)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Make sure to add this default export
export default EmployeesPage;

