import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ClockIcon, PenToolIcon as ToolIcon, ClipboardCheckIcon, SaveIcon, MessageSquareIcon, Loader2Icon, Image as ImageIcon, WrenchIcon } from 'lucide-react';
import { getProgram, completeProgram } from '../services/programService';
import { Program, Measurement, Tool } from '../types';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TimeTracker from '../components/programs/TimeTracker';
import MeasurementForm from '../components/programs/MeasurementForm';
import ToolsList from '../components/programs/ToolsList';
import DigitalSignature from '../components/programs/DigitalSignature';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/layout/PageHeader';
import DateTimeInput from '../components/ui/DateTimeInput';
import ImageModal from '../components/ui/ImageModal';
import { hfs } from '@humanfs/node';
import RecentCompletions from '../components/dashboard/RecentCompletions';
import ToolDetails from '../components/programs/ToolDetails';
import OperatorSelector from '../components/programs/OperatorSelector';

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedOperators, setSelectedOperators] = useState<Array<{id: string, matricula: string, nome: string}>>([]);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        if (!id) return;
        const data = await getProgram(id);
        console.log('Programa carregado na página:', data); // Debug log
        console.log('Comentários na página:', data.comments); // Debug log específico para comentários
        setProgram(data);
      } catch (error) {
        console.error('Erro ao carregar programa:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar programa');
      } finally {
        setIsLoading(false);
      }
    };

    loadProgram();
  }, [id]);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<string>('');
  const [processStartTime, setProcessStartTime] = useState<string>('');
  const [processEndTime, setProcessEndTime] = useState<string>('');
  const [timeErrors, setTimeErrors] = useState({
    start: '',
    end: '',
  });
  const [measurementNotes, setMeasurementNotes] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const validateTimes = () => {
    const errors = {
      start: '',
      end: '',
    };

    if (!processStartTime) {
      errors.start = 'Tempo de início é obrigatório';
    }

    // Não exigimos mais o tempo de fim, pois pode estar em andamento
    // Apenas validamos se ambos estiverem presentes
    if (processStartTime && processEndTime) {
      const start = new Date(processStartTime);
      const end = new Date(processEndTime);

      if (start > end) {
        errors.start = 'Tempo de início não pode ser posterior ao fim';
        errors.end = 'Tempo de fim não pode ser anterior ao início';
      }
    }

    setTimeErrors(errors);
    return !errors.start && !errors.end;
  };

  const handleMeasurementNotesChange = (notes: string) => {
    setMeasurementNotes(notes);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleMeasurementChange = (index: number, value: string) => {
    const updatedMeasurements = [...measurements];
    updatedMeasurements[index] = {
      ...updatedMeasurements[index],
      value: parseFloat(value),
      isVerified: parseFloat(value) >= updatedMeasurements[index].min && 
                  parseFloat(value) <= updatedMeasurements[index].max
    };
    setMeasurements(updatedMeasurements);
  };

  const handleSignatureChange = (dataUrl: string) => {
    setSignature(dataUrl);
  };

  const handleProgramComplete = async () => {
    if (!id || isSubmitting) return;

    // Validar tempos primeiro
    if (!validateTimes()) {
      showToast('Verifique os tempos de início e fim do processo', 'error');
      return;
    }

    // Validar se pelo menos um operador foi selecionado
    if (selectedOperators.length === 0 || !selectedOperators[0].matricula) {
      showToast('Selecione pelo menos um operador', 'error');
      return;
    }

    // Validar assinatura
    if (!signatureRef.current?.isEmpty()) {
      setIsSubmitting(true);

      try {
        const signatureImage = signatureRef.current?.toDataURL();
        
        // Aqui você enviaria os dados para o servidor
        // Incluindo os operadores selecionados
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de envio
        
        showToast('Programa concluído com sucesso!', 'success');
        navigate('/programs');
      } catch (error) {
        console.error('Erro ao concluir programa:', error);
        showToast('Erro ao concluir programa', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showToast('Assinatura é obrigatória', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Programa não encontrado'}</p>
          <Button
            onClick={() => navigate('/', { replace: true })}
            variant="secondary"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Voltar ao Painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Voltar ao Painel
          </button>
        </div>

        {/* Informações do Programa */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informações do Programa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Máquina</p>
              <p className="font-medium">{program.machine}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="font-medium">{program.material}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data</p>
              <p className="font-medium">{program.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Programador</p>
              <p className="font-medium">{program.programmer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Centro do Bloco</p>
              <p className="font-medium">{program.blockCenter}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referência</p>
              <p className="font-medium">{program.reference}</p>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tools and Measurements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tools Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <WrenchIcon className="h-5 w-5 mr-2 text-teal-700" />
                Ferramentas
              </h3>
              <div className="space-y-2">
                {program?.tools.map((tool, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTool(tool)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{tool.ferramenta.nome}</p>
                        <p className="text-xs text-gray-500">{tool.type} - {tool.function}</p>
                      </div>
                      <div className="text-gray-400 hover:text-gray-600">
                        <span className="text-xs">Clique para detalhes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ToolIcon className="h-5 w-5 mr-2 text-teal-700" />
                Especificações
              </h3>
              <div className="space-y-4">
                {program?.tools.map((tool, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">TIPO</h4>
                        <p className="text-sm">{tool.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">FUNÇÃO</h4>
                        <p className="text-sm">{tool.function}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">PARÂMETROS</h4>
                        <p className="text-sm">Velocidade: {tool.parameters.velocity}</p>
                        <p className="text-sm">Avanço: {tool.parameters.advance}</p>
                        <p className="text-sm">Profundidade: {tool.parameters.depth}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">QUALIDADE</h4>
                        <p className="text-sm">Tolerância: {tool.parameters.quality.tolerance}</p>
                        <p className="text-sm">Acabamento: {tool.parameters.quality.finishing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurements Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ClipboardCheckIcon className="h-5 w-5 mr-2 text-teal-700" />
                Verificação de Medidas
              </h3>
              <MeasurementForm 
                measurements={measurements} 
                onChange={handleMeasurementChange}
                measurementNotes={measurementNotes}
                onNotesChange={handleMeasurementNotesChange}
              />
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquareIcon className="h-5 w-5 mr-2 text-teal-700" />
                Comentários
              </h3>
              {/* Textarea para exibir comentários */}
              <textarea
                value={program?.comments || ''}
                readOnly
                className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed"
                rows={4}
                placeholder="Comentários do programa..."
              />
            </div>
          </div>

          {/* Right column - Image, Process Times, Digital Signature, and Submit */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-teal-700" />
                Imagem do Programa
              </h3>

              <div 
                className="cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img
                  src={`${window.location.origin}${program.imagePath}`}
                  alt="Imagem do Programa"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', e.currentTarget.src);
                    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Sem+Imagem';
                  }}
                />
              </div>
            </div>

            {/* Time Tracker Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-teal-700" />
                Rastreamento de Tempo
              </h3>
              <TimeTracker 
                startTime={processStartTime} 
                endTime={processEndTime}
                onTimeUpdate={(start, end, elapsed) => {
                  setProcessStartTime(start);
                  setProcessEndTime(end);
                  // Você pode armazenar o tempo decorrido em segundos se necessário
                }}
              />
            </div>

            {/* Operators Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <OperatorSelector
                selectedOperators={selectedOperators}
                onOperatorsChange={setSelectedOperators}
              />
            </div>

            {/* Digital Signature Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <SaveIcon className="h-5 w-5 mr-2 text-teal-700" />
                Assinatura Digital
              </h3>
              <DigitalSignature onChange={handleSignatureChange} />
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Button
                onClick={handleProgramComplete}
                disabled={isSubmitting}
                variant="primary"
                className="w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Concluir Programa
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <ImageModal
          imageUrl={program.imagePath || 'https://via.placeholder.com/800x600?text=Sem+Imagem'}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      </div>

      {/* Tool Details Modal */}
      {selectedTool && (
        <ToolDetails
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}

      {showCompletion && program && (
        <RecentCompletions
          program={program}
          onClose={() => {
            setShowCompletion(false);
            navigate('/', { replace: true });
          }}
        />
      )}
    </>
  );
};

export default ProgramDetailPage;





































