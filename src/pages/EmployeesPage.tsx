import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMongoCollection } from '../hooks/useMongoCollection';
import { Employee } from '../services/apiService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

function EmployeesPage() {
  const { data: employees, loading, error, refreshData } = useMongoCollection<Employee>('funcionarios');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.matricula.includes(searchTerm) ||
    (employee.cargo && employee.cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.departamento && employee.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Funcionários</h1>
        <button 
          onClick={refreshData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Atualizar
        </button>
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
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Make sure to add this default export
export default EmployeesPage;

