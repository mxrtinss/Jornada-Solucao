import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompletedPrograms } from '../services/programService';
import { Program } from '../types';
import CompletedProgramList from '../components/programs/CompletedProgramList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/layout/PageHeader';


const CompletedProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompletedPrograms();
  }, []);

  const loadCompletedPrograms = async () => {
    try {
      setLoading(true);
      const data = await getCompletedPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Erro ao carregar programas concluídos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramClick = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Programas Concluídos" 
        subtitle="Lista de todos os programas concluídos"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {programs.length > 0 ? (
            <CompletedProgramList 
              programs={programs} 
              onProgramClick={handleProgramClick} 
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Nenhum programa concluído encontrado</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedProgramsPage;