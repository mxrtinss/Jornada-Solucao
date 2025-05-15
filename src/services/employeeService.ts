import { Employee } from '../types/index';
import { apiService } from './apiService';

/**
 * Function to get all employees
 * @returns Promise with array of employees
 */
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    return await apiService.getFuncionarios();
  } catch (error) {
    console.error('Error in getEmployees:', error);
    throw error;
  }
};

/**
 * Function to get a specific employee by ID
 * @param id Employee ID
 * @returns Promise with employee data
 */
export const getEmployee = async (id: string): Promise<Employee> => {
  try {
    const employees = await apiService.getFuncionarios();
    const employee = employees.find(e => e._id === id);
    if (employee) {
      return employee;
    } else {
      throw new Error('Funcionário não encontrado');
    }
  } catch (error) {
    console.error('Error in getEmployee:', error);
    throw error;
  }
};

/**
 * Function to create a new employee
 * @param employee Employee data without ID
 * @returns Promise with created employee including ID
 */
export const createEmployee = async (employee: Omit<Employee, '_id'>): Promise<Employee> => {
  try {
    return await apiService.addFuncionario(employee);
  } catch (error) {
    console.error('Error in createEmployee:', error);
    throw error;
  }
};

/**
 * Function to update an existing employee
 * @param id Employee ID
 * @param employee Partial employee data to update
 * @returns Promise with updated employee
 */
export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  try {
    return await apiService.updateFuncionario(id, employee);
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    throw error;
  }
};

/**
 * Function to delete an employee
 * @param id Employee ID
 * @returns Promise with boolean indicating success
 */
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    await apiService.deleteFuncionario(id);
    return true;
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    throw error;
  }
};