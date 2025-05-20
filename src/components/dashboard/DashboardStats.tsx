import React from 'react';
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, RefreshCwIcon } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    remake: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  if (!stats) return null;

  const statsItems = [
    {
      label: 'Total de Programas',
      value: stats.total || 0,
      icon: <AlertCircleIcon className="h-6 w-6 text-gray-400" />,
    },
    {
      label: 'Programas Concluídos',
      value: stats.completed || 0,
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      trend: {
        value: stats.total ? (stats.completed / stats.total * 100) : 0,
        isPositive: true,
        label: '%'
      }
    },
    {
      label: 'Em Andamento',
      value: stats.inProgress || 0,
      icon: <ClockIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      label: 'Pendentes',
      value: stats.pending || 0,
      icon: <AlertCircleIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: 'Para Refazer',
      value: stats.remake || 0,
      icon: <RefreshCwIcon className="h-6 w-6 text-red-500" />,
    }
  ];

  return (
    <>
      {statsItems.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {item.icon}
              <span className="ml-2 text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-2xl font-semibold">{item.value}</span>
          </div>
          {item.trend && (
            <div className="mt-2 text-sm">
              <span className={item.trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                {item.trend.value.toFixed(1)}{item.trend.label}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default DashboardStats;

