import React from 'react';
import { Tool } from '../../types';
import Tooltip from '../ui/Tooltip';

interface ToolsListProps {
  tools: Tool[];
}

const ToolsList: React.FC<ToolsListProps> = ({ tools }) => {
  if (!tools || tools.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No tools information available for this program</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tools.map((tool, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-4 bg-white">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600">TIPO</h4>
              <p className="text-sm">{tool.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">FUNÇÃO</h4>
              <p className="text-sm">{tool.function}</p>
            </div>
            <div className="col-span-3">
              <h4 className="text-sm font-medium text-gray-600">FERRAMENTA</h4>
              <p className="text-sm">{tool.name}</p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600">PARÂMETROS</h4>
              <p className="text-sm">Vel: {tool.parameters.velocity}</p>
              <p className="text-sm">Av: {tool.parameters.advance}</p>
              <p className="text-sm">Prof: {tool.parameters.depth}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">QUALIDADE</h4>
              <p className="text-sm">Tol: {tool.parameters.quality.tolerance}</p>
              <p className="text-sm">Acab: {tool.parameters.quality.finishing}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsList;
