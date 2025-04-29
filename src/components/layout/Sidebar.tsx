import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  ClipboardListIcon, 
  SettingsIcon, 
  BarChartIcon, 
  HelpCircleIcon 
} from 'lucide-react';
import { LogoIcon } from '../icons/LogoIcon';
import Tooltip from '../ui/Tooltip';

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
            to="/reports" 
            className={({ isActive }) => 
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-teal-900 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`
            }
          >
            <BarChartIcon className="mr-3 h-6 w-6 flex-shrink-0" />
            Reports
          </NavLink>
        </nav>
      </div>
      
      {/* Bottom links */}
      <div className="p-4 border-t border-teal-700">
        <div className="space-y-3">
          <Tooltip content="Ajuda e Documentação">
            <button className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-700 hover:text-white">
              <HelpCircleIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Ajuda
            </button>
          </Tooltip>
          
          <Tooltip content="Configurações do Sistema">
            <button className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-700 hover:text-white">
              <SettingsIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              Configurações
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

