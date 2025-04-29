import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, BellIcon, HelpCircleIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { LogoIcon } from '../icons/LogoIcon';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-0 z-40 flex md:hidden
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-teal-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <Sidebar />
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <div className="md:hidden flex items-center ml-2">
                <LogoIcon className="h-8 w-8 text-teal-700" />
                <span className="ml-2 text-lg font-semibold text-gray-800">
                  Industrial Ops
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full">
                <span className="sr-only">Get help</span>
                <HelpCircleIcon className="h-6 w-6" />
              </button>
              
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Usuário'}</span>
                    <span className="text-xs text-gray-500">{user?.role || 'Operador'}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
