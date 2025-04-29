import React from 'react';
import { Program } from '../../types';
import { Badge } from '../ui';
import { ImageModal } from '../ui';

interface ProgramDetailsProps {
  program: Program;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ program }) => {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{program.programId}</h2>
          <Badge 
            variant={program.status === 'Em Andamento' ? 'primary' : 'warning'}
          >
            {program.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium w-24">Material:</span>
              <span>{program.material}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Máquina:</span>
              <span>{program.machine}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Referência:</span>
              <span>{program.reference}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Data:</span>
              <span>{program.date}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Programador:</span>
              <span>{program.programmer}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-24">Centro:</span>
              <span>{program.center}</span>
            </div>
          </div>
        </div>

        {program.imagePath && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Imagem do Programa</h3>
            <div 
              className="cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={program.imagePath}
                alt="Programa"
                className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          </div>
        )}
      </div>

      {/* Seção de Comentários */}
      {program.comments && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Comentários</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{program.comments}</p>
          </div>
        </div>
      )}

      <ImageModal
        imageUrl={program.imagePath || ''}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};

export default ProgramDetails;