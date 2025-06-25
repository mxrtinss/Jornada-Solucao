// API service to communicate with your backend
const API_URL = 'http://localhost:3001/api';

export interface Operator {
  _id: string;
  matricula: string;
  nome: string;
  cargo?: string;
  departamento?: string;
  email?: string;
  telefone?: string;
  dataAdmissao?: string;
  ativo?: boolean;
}

export type Employee = Operator;

export const apiService = {
  // Fetch funcionarios from the backend
  async getFuncionarios(): Promise<Employee[]> {
    try {
      console.log('Fetching funcionarios from:', `${API_URL}/funcionarios`);
      const response = await fetch(`${API_URL}/funcionarios`);
      
      if (!response.ok) {
        console.error(`API error status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} funcionarios from API`);
      return data;
    } catch (error) {
      console.error('Error fetching funcionarios:', error);
      throw error;
    }
  },

  // Add a new funcionario
  async addFuncionario(data: Omit<Employee, '_id'>): Promise<Employee> {
    try {
      console.log('Sending request to create funcionario:', data);
      const response = await fetch(`${API_URL}/funcionarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Erro ao criar funcionário');
        } catch (e) {
          throw new Error(`Erro ao criar funcionário: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('Successfully created funcionario:', result);
      return result;
    } catch (error) {
      console.error('Error in addFuncionario:', error);
      throw error;
    }
  },

  // Update a funcionario
  async updateFuncionario(id: string, data: Partial<Employee>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/funcionarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating funcionario');
      }
    } catch (error) {
      console.error('Error updating funcionario:', error);
      throw error;
    }
  },

  // Delete a funcionario
  async deleteFuncionario(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/funcionarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting funcionario');
      }
    } catch (error) {
      console.error('Error deleting funcionario:', error);
      throw error;
    }
  },

  // Verify operator password
  async verifyOperatorPassword(matricula: string, senha: string): Promise<{ success: boolean; message: string; funcionario?: any }> {
    try {
      const response = await fetch(`${API_URL}/operators/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar senha');
      }

      return data;
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  },

  // Other methods...
};








