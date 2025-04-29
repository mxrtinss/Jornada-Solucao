export const validateLoginForm = (username: string, password: string) => {
  const errors: Record<string, string> = {};
  
  if (!username) {
    errors.username = 'Username is required';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return errors;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};