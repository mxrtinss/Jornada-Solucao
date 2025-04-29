import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-teal-700">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Página Não Encontrada</h2>
        <p className="text-gray-500 mt-2 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button 
          onClick={() => navigate('/')} 
          variant="primary"
          className="inline-flex items-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Voltar ao Painel de Controle
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;


