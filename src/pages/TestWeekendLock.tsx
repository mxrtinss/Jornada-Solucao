import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import WeekendLockScreen from '../components/auth/WeekendLockScreen';

const TestWeekendLock: React.FC = () => {
  const [showLockScreen, setShowLockScreen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste de Bloqueio de Final de Semana</h1>
      
      <div className="mb-6">
        <Button 
          onClick={() => setShowLockScreen(!showLockScreen)}
          variant="primary"
        >
          {showLockScreen ? 'Esconder' : 'Mostrar'} Tela de Bloqueio
        </Button>
      </div>
      
      {showLockScreen && (
        <div className="fixed inset-0 z-50">
          <WeekendLockScreen />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Como funciona:</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>O sistema verifica automaticamente se é final de semana (sábado ou domingo)</li>
          <li>Se for final de semana, a tela de bloqueio é exibida em vez do conteúdo normal</li>
          <li>Para acessar o sistema, o usuário precisa inserir a senha correta</li>
          <li>Após o desbloqueio, o acesso permanece liberado até o final da sessão</li>
        </ol>
      </div>
    </div>
  );
};

export default TestWeekendLock;