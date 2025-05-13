import { Employee } from '../types/index';

// Dados simulados para funcionários
let mockEmployees: Employee[] = [
  {
    id: '1',
    matricula: '12345',
    nome: 'João Silva',
    cargo: 'Operador CNC',
    departamento: 'Produção',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 98765-4321',
    dataAdmissao: '2020-03-15',
    ativo: true
  },
  {
    id: '2',
    matricula: '23456',
    nome: 'Maria Oliveira',
    cargo: 'Supervisora',
    departamento: 'Produção',
    email: 'maria.oliveira@empresa.com',
    telefone: '(11) 91234-5678',
    dataAdmissao: '2018-07-10',
    ativo: true
  },
  {
    id: '3',
    matricula: '34567',
    nome: 'Pedro Santos',
    cargo: 'Técnico de Manutenção',
    departamento: 'Manutenção',
    email: 'pedro.santos@empresa.com',
    telefone: '(11) 92345-6789',
    dataAdmissao: '2019-11-05',
    ativo: true
  }
];

// Função para obter todos os funcionários
export const getEmployees = async (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEmployees]); // Retorna uma cópia para evitar mutações acidentais
    }, 500);
  });
};

// Função para obter um funcionário específico
export const getEmployee = async (id: string): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployees.find(e => e.id === id);
      if (employee) {
        resolve({...employee}); // Retorna uma cópia para evitar mutações acidentais
      } else {
        reject(new Error('Funcionário não encontrado'));
      }
    }, 300);
  });
};

// Função para criar um novo funcionário
export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newEmployee = {
        ...employee,
        id: newId
      };
      
      // Adiciona o novo funcionário ao array
      mockEmployees = [...mockEmployees, newEmployee];
      
      console.log('Funcionário criado:', newEmployee);
      console.log('Total de funcionários:', mockEmployees.length);
      
      resolve({...newEmployee}); // Retorna uma cópia para evitar mutações acidentais
    }, 500);
  });
};

// Função para atualizar um funcionário
export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        const updatedEmployee = { ...mockEmployees[index], ...employee };
        mockEmployees = [
          ...mockEmployees.slice(0, index),
          updatedEmployee,
          ...mockEmployees.slice(index + 1)
        ];
        
        console.log('Funcionário atualizado:', updatedEmployee);
        console.log('Total de funcionários:', mockEmployees.length);
        
        resolve({...updatedEmployee}); // Retorna uma cópia para evitar mutações acidentais
      } else {
        reject(new Error('Funcionário não encontrado'));
      }
    }, 500);
  });
};

// Função para excluir um funcionário
export const deleteEmployee = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        console.log('Excluindo funcionário com ID:', id);
        console.log('Total antes da exclusão:', mockEmployees.length);
        
        mockEmployees = [
          ...mockEmployees.slice(0, index),
          ...mockEmployees.slice(index + 1)
        ];
        
        console.log('Total após exclusão:', mockEmployees.length);
        resolve(true);
      } else {
        console.log('Funcionário não encontrado para exclusão:', id);
        reject(new Error('Funcionário não encontrado'));
      }
    }, 500);
  });
};



