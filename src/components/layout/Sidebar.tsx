import React from 'react';
import { NavLink } from 'react-router-dom';
import {  
  LayoutDashboardIcon, 
  ClipboardListIcon,  
  CheckCircleIcon,
  UsersIcon 
} from 'lucide-react';
import { LogoIcon } from '../icons/LogoIcon';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-teal-800 text-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-teal-700">
        <LogoIcon className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-semibold">Operações Industriais</span>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-teal-900 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`
            }
            end
          >
            <LayoutDashboardIcon className="mr-3 h-6 w-6 flex-shrink-0" />
            Painel de Controle
          </NavLink>
          
          <NavLink 
            to="/programs" 
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-teal-900 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`
            }
          >
            <ClipboardListIcon className="mr-3 h-6 w-6 flex-shrink-0" />
            Programas
          </NavLink>
          
          <NavLink 
            to="/completed-programs" 
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-teal-900 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`
            }
          >
            <CheckCircleIcon className="mr-3 h-6 w-6 flex-shrink-0" />
            Programas Concluídos
          </NavLink>
          
          {/* Link para a página de funcionários */}
          <NavLink 
            to="/employees" 
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-teal-900 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`
            }
          >
            <UsersIcon className="mr-3 h-6 w-6 flex-shrink-0" />
            Funcionários
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

