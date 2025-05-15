// API service to communicate with your backend
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

  // Other methods...
};








