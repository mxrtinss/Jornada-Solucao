import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, PageHeader } from '../components/ui';
import { DashboardStats, ProgramCard } from '../components/dashboard';
import { getDashboardData } from '../services/programService';
import { DashboardData } from '../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleProgramClick = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  const sortPrograms = (programs) => {
    if (!programs) return [];
    
    return [...programs].sort((a, b) => {
      // Ordem de prioridade: Em Andamento > Pendente > Refazer
      const statusOrder = {
        'Em Andamento': 1,
        'Pendente': 2,
        'Refazer': 3,
        'Concluído': 4
      };
      
      // Comparar por status primeiro
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison !== 0) return statusComparison;
      
      // Se o status for o mesmo, ordenar por ID do programa
      return a.programId.localeCompare(b.programId);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Painel de Operações" />
      
      {/* Dashboard Stats Section - Fixed layout with responsive grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData?.stats && <DashboardStats stats={dashboardData.stats} />}
        </div>
      </div>

      {/* Active Programs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Programas Ativos</h2>
        
        {dashboardData?.activePrograms && dashboardData.activePrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortPrograms(dashboardData.activePrograms).map((program) => (
              <ProgramCard 
                key={program.id}
                program={program}
                onClick={handleProgramClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Nenhum programa ativo no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

