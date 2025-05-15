// This service is now just a placeholder that uses the API service
// instead of connecting directly to MongoDB from the browser
import { apiService } from './apiService';

const mongoDbService = {
  // This method is kept for backward compatibility
  connect: async () => {
    console.log('Using API service instead of direct MongoDB connection');
    return Promise.resolve();
  },
  
  // Redirect all MongoDB operations to use the API service
  getOperators: () => {
    // Use getFuncionarios since they're the same collection
    return apiService.getFuncionarios();
  },
  
  // Add funcionarios methods
  getFuncionarios: () => {
    return apiService.getFuncionarios();
  }
};

export default mongoDbService;


