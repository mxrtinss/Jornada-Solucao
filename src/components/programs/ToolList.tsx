import React from 'react';
import { Tool } from '../../types';

interface ToolListProps {
  tools: Tool[];
}

const ToolList: React.FC<ToolListProps> = ({ tools }) => {
  if (!tools || tools.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Nenhuma ferramenta disponível para este programa</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tools.map((tool, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-4">
          <div className="grid grid-cols-5 gap-4 mb-4">
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

          <div className="grid grid-cols-2 gap-8">
            <div>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4">Ø</td>
                    <td className="py-1">48</td>
                    <td className="py-1 pr-4 pl-8">RC</td>
                    <td className="py-1">-</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4">Rib.</td>
                    <td className="py-1">247</td>
                    <td className="py-1 pr-4 pl-8">Alt.</td>
                    <td className="py-1">273</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4">Lat. 2D</td>
                    <td className="py-1">-</td>
                    <td className="py-1 pr-4 pl-8">Lat.</td>
                    <td className="py-1">-</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-4">Vert.</td>
                    <td className="py-1">3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="mb-3">
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
        </div>
      ))}
    </div>
  );
};

export default ToolList;

