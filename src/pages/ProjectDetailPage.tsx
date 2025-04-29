import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../types';
import { getProjectById } from '../services/programService';
import { CalendarIcon, Users2Icon, ClipboardListIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Projeto não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className={`px-3 py-1 rounded-full text-sm ${
              project.status.toLowerCase() === 'em andamento' ? 'bg-blue-100 text-blue-800' :
              project.status.toLowerCase() === 'concluído' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Users2Icon className="h-5 w-5 mr-2" />
              <span>Cliente: {project.customer}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Início: {format(new Date(project.startDate), "dd 'de' MMMM',' yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Previsão de término: {format(new Date(project.expectedEndDate), "dd 'de' MMMM',' yyyy", { locale: ptBR })}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <ClipboardListIcon className="h-6 w-6 mr-2" />
            Programas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.programs.map((program) => (
              <div key={program.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">{program.programName}</h3>
                <div className="text-sm text-gray-600">
                  <p>Material: {program.material}</p>
                  <p>Status: {program.status}</p>
                  <p>Referência: {program.reference}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}