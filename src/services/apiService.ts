// API service to communicate with your backend
// Use environment variables for API URL to support different environments
const API_URL = import.meta.env.VITE_API_URL || '/api';

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

// Use the same interface for Employee since they have the same structure
export type Employee = Operator;

export const apiService = {
  // Fetch operators from the backend (using funcionarios collection)
  async getOperators(): Promise<Operator[]> {
    try {
      console.log('Fetching operators from:', `${API_URL}/operators`);
      const response = await fetch(`${API_URL}/operators`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching operators:', error);
      throw error;
    }
  },

  // Fetch funcionarios from the backend
  async getFuncionarios(): Promise<Employee[]> {
    try {
      console.log('Fetching funcionarios from:', `${API_URL}/funcionarios`);
      const response = await fetch(`${API_URL}/funcionarios`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching funcionarios:', error);
      throw error;
    }
  },

  // Add a test method to verify API connection
  async testConnection(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/test`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error testing API connection:', error);
      throw error;
    }
  }
};







