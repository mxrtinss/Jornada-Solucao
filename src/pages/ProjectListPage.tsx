import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { getProjects } from '../services/programService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CalendarIcon, Users2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em andamento':
        return 'bg-blue-500';
      case 'concluído':
        return 'bg-green-500';
      case 'pendente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projetos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-xl font-bold">{project.projectName}</span>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {project.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{project.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users2Icon className="h-4 w-4 mr-2" />
                  <span>{project.customer}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(project.startDate), "dd 'de' MMMM',' yyyy", { locale: ptBR })}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {project.programs.length} programa(s)
                  </span>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}