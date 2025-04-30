import React from 'react';
import { XIcon } from 'lucide-react';
import { Tool } from '../../types';

interface ToolDetailsProps {
  tool: Tool;
  onClose: () => void;
}

const ToolDetails: React.FC<ToolDetailsProps> = ({ tool, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-6">{tool.ferramenta.nome}</h2>

        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Dimensões</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(tool.ferramenta.dimensoes).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">{key}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetails;
