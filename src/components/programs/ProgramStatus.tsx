import React from 'react';
import { ProgramStatusItem } from '../../types';
import { Circle, CheckCircle, Clock, HelpCircle } from 'lucide-react';

interface ProgramStatusProps {
  programStatuses: ProgramStatusItem[];
}

const ProgramStatus: React.FC<ProgramStatusProps> = ({ programStatuses }) => {
  if (!programStatuses || programStatuses.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No program status data available</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Pending':
        return <Circle className="h-5 w-5 text-amber-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Concluído';
      case 'In Progress':
        return 'Em Andamento';
      case 'Pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="flow-root">
      <ul className="divide-y divide-gray-200">
        {programStatuses.map((item) => (
          <li key={item.programId} className="py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getStatusIcon(item.status)}
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Programa {item.programId}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {item.lastUpdated}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {getStatusText(item.status)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramStatus;
