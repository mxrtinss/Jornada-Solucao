import React from 'react';
import { Employee } from '../../types/index';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.matricula}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.cargo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.departamento}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.ativo ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <UserCheck className="h-4 w-4 mr-1" /> Ativo
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    <UserX className="h-4 w-4 mr-1" /> Inativo
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(employee.id)}
                  className="text-teal-600 hover:text-teal-900 mr-3"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;