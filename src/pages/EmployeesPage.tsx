import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { Employee } from '../types/index';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import AdminAuthModal from '../components/employees/AdminAuthModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/layout/PageHeader';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticação básica
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/employees');
    }
  }, [isAuthenticated, navigate]);

  // Verificar se já está autenticado como admin (via sessionStorage)
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    } else {
      // Mostrar modal de autenticação admin ao carregar a página
      setShowAdminAuth(true);
    }
  }, []);

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
    if (isAuthenticated && isAdminAuthenticated) {
      loadEmployees();
    }
  }, [loadEmployees, isAuthenticated, isAdminAuthenticated]);

  // Função para lidar com a autenticação de administrador
  const handleAdminAuthentication = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setShowAdminAuth(false);
      // Salvar estado de autenticação admin na sessão
      sessionStorage.setItem('adminAuthenticated', 'true');
      // Carregar dados após autenticação bem-sucedida
      loadEmployees();
      showToast('Acesso administrativo concedido', 'success');
    } else {
      setShowAdminAuth(false);
      navigate('/');
      showToast('Acesso negado à área administrativa', 'error');
    }
  };

  // Abrir formulário para novo funcionário
  const handleAddNew = () => {
    setCurrentEmployee(undefined);
    setShowForm(true);
  };

  // Abrir formulário para editar funcionário
  const handleEdit = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setCurrentEmployee({...employee});
      setShowForm(true);
    }
  };

  // Abrir modal de confirmação para excluir
  const handleDelete = (id: string) => {
    setConfirmDelete(id);
  };

  // Confirmar exclusão de funcionário
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

  // Enviar formulário (criar ou atualizar)
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
      
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      showToast('Erro ao salvar funcionário', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se não estiver autenticado, não renderiza nada (será redirecionado)
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Se não estiver autenticado como admin e não estiver mostrando o modal de autenticação
  if (!isAdminAuthenticated && !showAdminAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Funcionários" 
        subtitle="Gerenciamento de funcionários da empresa" 
      />
      
      {isAdminAuthenticated && (
        <>
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
        </>
      )}

      {/* Modal de autenticação de administrador */}
      {showAdminAuth && (
        <AdminAuthModal 
          onAuthenticate={handleAdminAuthentication}
          onCancel={() => {
            setShowAdminAuth(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default EmployeesPage;









