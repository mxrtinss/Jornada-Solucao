import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ClockIcon, 
  PenToolIcon as ToolIcon, 
  ClipboardCheckIcon, 
  SaveIcon, 
  MessageSquareIcon, 
  Loader2Icon, 
  Image as ImageIcon, 
  WrenchIcon,
  RefreshCwIcon,
  Clock
} from 'lucide-react';
import { getProgram, completeProgram, updateProgramStatus } from '../services/programService';
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
  
  // Adicione esta linha para definir a referência
  const signatureRef = React.useRef<any>(null);

  // Adicione este estado no início do componente
  const [measurementVerified, setMeasurementVerified] = useState(false);

  // Adicione um novo estado para controlar o refazer programa
  const [isRemaking, setIsRemaking] = useState(false);

  // Adicione um novo estado para controlar o botão de retornar para "Em Andamento"
  const [isReturningToProgress, setIsReturningToProgress] = useState(false);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        if (!id) return;
        const data = await getProgram(id);
        console.log('Programa carregado na página:', data); // Debug log
        console.log('Comentários na página:', data.comments); // Debug log específico para comentários
        setProgram(data);
        
        // Inicializar as notas de medição se existirem no programa
        if (data.measurementNotes) {
          console.log('Notas de medição carregadas:', data.measurementNotes);
          setMeasurementNotes(data.measurementNotes);
        }
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

  // Função para atualizar as notas de medição com log para depuração
  const handleMeasurementNotesChange = (notes: string) => {
    console.log("Notas de medição atualizadas:", notes);
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
    console.log("Função handleProgramComplete iniciada");
    
    if (!id || isSubmitting) {
      console.log("Saindo da função: id não encontrado ou já está enviando");
      return;
    }

    // Array para armazenar mensagens de erro
    const errors = [];

    // 1. Validar Verificação de Medidas
    console.log("Verificação de medidas concluída?", measurementVerified);
    
    if (!measurementVerified) {
      errors.push('Confirme a verificação de medidas clicando no botão "Confirmar Verificação"');
    }

    // 2. Validar Rastreamento de Tempo
    console.log("Validando tempos:", processStartTime, processEndTime);
    if (!processStartTime) {
      errors.push('Inicie o rastreamento de tempo');
    }
    
    if (!processEndTime) {
      errors.push('Finalize o rastreamento de tempo clicando em "Parar"');
    }

    // 3. Validar Operadores
    console.log("Validando operadores:", selectedOperators);
    const hasValidOperators = selectedOperators && 
      selectedOperators.length > 0 && 
      selectedOperators.some(op => op.matricula && op.nome);
    
    if (!hasValidOperators) {
      errors.push('Selecione pelo menos um operador válido');
    }

    // 4. Validar Assinatura Digital
    const hasSignature = signatureRef && signatureRef.current && !signatureRef.current.isEmpty();
    console.log("Validando assinatura:", hasSignature);
    
    if (!hasSignature) {
      errors.push('A assinatura digital é obrigatória');
    }

    // Se houver erros, exibir mensagens e interromper o processo
    if (errors.length > 0) {
      console.log("Erros encontrados:", errors);
      // Exibir todos os erros em uma única mensagem
      showToast(`Para concluir o programa: ${errors.join('; ')}`, 'error');
      return;
    }

    console.log("Todas as validações passaram, enviando dados...");
    // Se chegou aqui, todas as validações passaram
    setIsSubmitting(true);

    try {
      const signatureImage = signatureRef.current?.toDataURL();
      
      // Preparar dados para envio
      const programData = {
        id,
        measurements,
        timeTracking: {
          startTime: processStartTime,
          endTime: processEndTime
        },
        operators: selectedOperators,
        signature: signatureImage
      };
      
      console.log('Enviando dados do programa:', programData);
      
      // Simulação de envio para o servidor
      await completeProgram(id, {
        processStartTime,
        processEndTime,
        measurements,
        signature: signatureImage,
        comments: ''
      });
      
      console.log("Programa concluído com sucesso!");
      showToast('Programa concluído com sucesso! Redirecionando em 5 segundos...', 'success');
      setShowCompletion(true);
      
      // Adicionar temporizador para redirecionar após 5 segundos
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 5000);
    } catch (error) {
      console.error('Erro ao concluir programa:', error);
      showToast('Erro ao concluir programa. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adicione esta função para lidar com a verificação
  const handleMeasurementVerify = () => {
    if (measurementNotes && measurementNotes.trim().length > 0) {
      console.log("Verificação de medidas confirmada");
      setMeasurementVerified(true);
      showToast("Verificação de medidas confirmada com sucesso!", "success");
    } else {
      console.log("Não é possível verificar: campo vazio");
      showToast("Preencha o campo de verificação de medidas", "error");
    }
  };

  // Adicione esta função para lidar com o refazer programa
  const handleProgramRemake = async () => {
    if (!id || isSubmitting || isRemaking) {
      return;
    }
    
    setIsRemaking(true);
    
    try {
      // Atualizar o status no servidor primeiro
      await updateProgramStatus(id, 'Refazer');
      
      // Reset dos estados
      setMeasurements([]);
      setProcessStartTime(null);
      setProcessEndTime(null);
      setMeasurementVerified(false);
      setMeasurementNotes('');
      
      if (signatureRef.current) {
        signatureRef.current.clear();
      }
      
      // Atualizar o programa localmente
      if (program) {
        const updatedProgram = {
          ...program,
          status: 'Refazer',
          measurements: [],
          processStartTime: null,
          processEndTime: null,
          measurementVerification: '',
          signature: null
        };
        
        setProgram(updatedProgram);
      }
      
      showToast('Programa marcado para refazer!', 'success');
    } catch (error) {
      console.error('Erro ao refazer programa:', error);
      showToast('Erro ao refazer programa. Tente novamente.', 'error');
    } finally {
      setIsRemaking(false);
    }
  };

  // Adicione esta função para lidar com o retorno para "Em Andamento"
  const handleReturnToProgress = async () => {
    if (!id || isSubmitting || isRemaking || isReturningToProgress) {
      return;
    }
    
    setIsReturningToProgress(true);
    
    try {
      // Atualizar o status no servidor
      await updateProgramStatus(id, 'Em Andamento');
      
      // Atualizar o programa localmente
      if (program) {
        const updatedProgram = {
          ...program,
          status: 'Em Andamento'
        };
        
        setProgram(updatedProgram);
      }
      
      showToast('Programa retornado para Em Andamento!', 'success');
    } catch (error) {
      console.error('Erro ao retornar programa para Em Andamento:', error);
      showToast('Erro ao atualizar status do programa. Tente novamente.', 'error');
    } finally {
      setIsReturningToProgress(false);
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

  // Remover esta função de teste
  // const testToast = () => {
  //   console.log("Testando toast");
  //   showToast("Teste de mensagem toast", "info");
  // };

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
                isVerified={measurementVerified}
                onVerify={handleMeasurementVerify}
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
              <DigitalSignature 
                ref={signatureRef} 
                onChange={handleSignatureChange}
                operators={selectedOperators}
                onOperatorAuthenticated={(operator) => {
                  console.log(`Operador ${operator.nome} autenticado com sucesso`);
                }}
              />
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Botão para retornar para Em Andamento (visível apenas se o status for "Refazer") */}
                {program.status === 'Refazer' && (
                  <Button
                    onClick={() => {
                      console.log("Botão Retornar para Em Andamento clicado");
                      handleReturnToProgress();
                    }}
                    disabled={isSubmitting || isRemaking || isReturningToProgress}
                    variant="info"
                    className="flex-1 flex items-center justify-center"
                    size="sm"
                  >
                    {isReturningToProgress ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-1" />
                        Em Andamento
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    console.log("Botão Refazer Programa clicado");
                    handleProgramRemake();
                  }}
                  disabled={isSubmitting || isRemaking || isReturningToProgress}
                  variant="secondary"
                  className="flex-1 flex items-center justify-center"
                  size="sm"
                >
                  {isRemaking ? (
                    <>
                      <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                      Reiniciando...
                    </>
                  ) : (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-1" />
                      Refazer
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => {
                    console.log("Botão Concluir Programa clicado");
                    handleProgramComplete();
                  }}
                  disabled={isSubmitting || isRemaking || isReturningToProgress}
                  variant="primary"
                  className="flex-1 flex items-center justify-center"
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-1" />
                      Concluir
                    </>
                  )}
                </Button>
              </div>
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

      {/* Remover o botão de teste de toast abaixo */}
      {/* 
      <button 
        onClick={testToast}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Testar Toast
      </button>
      */}
    </>
  );
};

export default ProgramDetailPage;


















