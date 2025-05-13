import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { Employee } from '../types/index';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/layout/PageHeader';
import { useToast } from '../contexts/ToastContext';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Função para carregar funcionários
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      console.log('Funcionários carregados:', data.length);
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      showToast('Erro ao carregar funcionários', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Carregar funcionários ao montar o componente
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleAddNew = () => {
    setCurrentEmployee(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setCurrentEmployee({...employee});
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteEmployee = async () => {
    if (!confirmDelete) return;
    
    try {
      console.log('Tentando excluir funcionário:', confirmDelete);
      await deleteEmployee(confirmDelete);
      
      // Atualizar estado após exclusão bem-sucedida
      setEmployees(prevEmployees => 
        prevEmployees.filter(e => e.id !== confirmDelete)
      );
      
      showToast('Funcionário excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      showToast('Erro ao excluir funcionário', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (currentEmployee) {
        // Atualizar funcionário existente
        console.log('Atualizando funcionário:', currentEmployee.id);
        const updated = await updateEmployee(currentEmployee.id, employeeData);
        
        setEmployees(prevEmployees => 
          prevEmployees.map(e => e.id === currentEmployee.id ? updated : e)
        );
        
        showToast('Funcionário atualizado com sucesso', 'success');
      } else {
        // Criar novo funcionário
        console.log('Criando novo funcionário');
        const created = await createEmployee(employeeData);
        
        setEmployees(prevEmployees => [...prevEmployees, created]);
        
        showToast('Funcionário cadastrado com sucesso', 'success');
      }
      
      // Fechar formulário após sucesso
      setShowForm(false);
      
      // Recarregar a lista para garantir sincronização
      await loadEmployees();
      
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      showToast('Erro ao salvar funcionário', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Funcionários" 
        subtitle="Gerenciamento de funcionários da empresa" 
      />
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          disabled={isSubmitting}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Novo Funcionário
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {employees.length > 0 ? (
            <EmployeeList 
              employees={employees} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Nenhum funcionário cadastrado</p>
            </div>
          )}
        </>
      )}

      {/* Modal de formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl">
            <EmployeeForm 
              employee={currentEmployee} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar Exclusão</h3>
            </div>
            <p className="mb-4">
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteEmployee}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;





