import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, PageHeader } from '../components/ui';
import { DashboardStats } from '../components/dashboard';
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardData?.stats && <DashboardStats stats={dashboardData.stats} />}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Programas Ativos</h2>
        
        {dashboardData?.activePrograms && dashboardData.activePrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.activePrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProgramClick(program.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{program.programId}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    program.status === 'Em Andamento' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {program.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Máquina:</span>
                    {program.machine}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Material:</span>
                    {program.material}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">Referência:</span>
                    {program.reference}
                  </div>
                </div>
              </div>
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

