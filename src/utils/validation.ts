export const validateLoginForm = (username: string, password: string, machineId?: string) => {
  const errors: Record<string, string> = {};
  
  if (!username) {
    errors.username = 'Username is required';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (machineId !== undefined && !machineId) {
    errors.machineId = 'Machine selection is required';
  }
  
  return errors;
};

export const validateMachineId = (machineId: string) => {
  const machineIdRegex = /^MAC-\d{3}$/;
  return machineIdRegex.test(machineId);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};