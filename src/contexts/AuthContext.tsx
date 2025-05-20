import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  isWeekendLocked: boolean;
  unlockWeekend: (password: string) => boolean;
  weekendUnlocked: boolean;
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Adicione a senha de desbloqueio do final de semana
const WEEKEND_UNLOCK_PASSWORD = "senha123"; // Substitua por uma senha forte

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  isWeekendLocked: false,
  unlockWeekend: () => false,
  weekendUnlocked: false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isWeekendLocked, setIsWeekendLocked] = useState<boolean>(false);
  const [weekendUnlocked, setWeekendUnlocked] = useState<boolean>(false);
  
  // Verifica se é final de semana
  const checkIfWeekend = () => {
    
    const today = new Date();
    const day = today.getDay(); // 0 = domingo, 6 = sábado
    return day === 0 || day === 6;
  };
  
  // Verifica se é final de semana ao carregar e a cada minuto
  useEffect(() => {
    const checkWeekendStatus = () => {
      const isWeekend = checkIfWeekend();
      setIsWeekendLocked(isWeekend && !weekendUnlocked);
    };
    
    // Verifica imediatamente
    checkWeekendStatus();
    
    // Verifica a cada minuto
    const interval = setInterval(checkWeekendStatus, 60000);
    
    // Verifica se há um desbloqueio salvo
    const savedUnlock = localStorage.getItem('weekendUnlocked');
    if (savedUnlock === 'true') {
      setWeekendUnlocked(true);
    }
    
    return () => clearInterval(interval);
  }, [weekendUnlocked]);
  
  // Função para desbloquear o acesso no final de semana
  const unlockWeekend = (password: string): boolean => {
    if (password === WEEKEND_UNLOCK_PASSWORD) {
      setWeekendUnlocked(true);
      localStorage.setItem('weekendUnlocked', 'true');
      return true;
    }
    return false;
  };
  
  // Check for saved authentication on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // In a real app, this would be an API call
    // This is a mock implementation for demo purposes
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (accept any non-empty username/password)
      if (username && password) {
        const mockUser: User = {
          id: '1',
          username,
          name: 'F1400',
          role: 'maquina',
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        // Store user in localStorage if rememberMe is true
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      isWeekendLocked, 
      unlockWeekend, 
      weekendUnlocked 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
