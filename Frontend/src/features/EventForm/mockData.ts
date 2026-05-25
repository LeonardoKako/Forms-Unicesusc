export interface RoomOption {
  value: string
  label: string
  capacity: number
  location: string
}

export const ROOM_OPTIONS: RoomOption[] = [
  { value: 'campus', label: 'Campus', capacity: 1000, location: 'Área Externa' },
  { value: 'auditorio', label: 'Auditório Principal', capacity: 228, location: 'Bloco A' },
  { value: 'sala_aula', label: 'Sala de Aula', capacity: 60, location: 'Blocos Diversos' },
  { value: 'ginasio_esportes', label: 'Ginásio de Esportes', capacity: 500, location: 'Ginásio' },
  { value: 'colegio', label: 'Colégio', capacity: 300, location: 'Colégio' },
  { value: 'lab_info', label: 'Laboratório de Informática', capacity: 30, location: 'Bloco B' },
]

export interface OptionItem {
  id: string;
  label: string;
  hasInfo?: boolean;
}

export const TARGET_AUDIENCE_OPTIONS: OptionItem[] = [
  { id: 'aberto_publico', label: 'Evento aberto ao público' },
  { id: 'externo', label: 'Evento externo' },
  { id: 'colaboradores', label: 'Evento exclusivo para Colaboradores' },
  { id: 'alunos', label: 'Evento exclusivo para alunos' },
  { id: 'docentes', label: 'Evento exclusivo para Docentes' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];

export const COPA_OPTIONS: OptionItem[] = [
  { id: 'garrafa_termica', label: 'Garrafa Térmica' },
  { id: 'jarra', label: 'Jarra' },
  { id: 'guardanapos', label: 'Guardanapos' },
  { id: 'tacas_copos', label: 'Taças/Copos' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];

export const COFFEE_BREAK_OPTIONS: OptionItem[] = [
  { id: 'cafe', label: 'Café' },
  { id: 'biscoito_maizena', label: 'Biscoito Maizena' },
  { id: 'salgadinhos', label: 'Salgadinhos' },
  { id: 'agua', label: 'Água' },
  { id: 'nao_se_aplica', label: 'Não será preciso/não se aplica' },
];

export const TI_EQUIPMENT_OPTIONS: OptionItem[] = [
  { id: 'microfones', label: 'Microfones' },
  { id: 'projetor_pequeno', label: 'Projetor Pequeno', hasInfo: true },
  { id: 'projetor_grande', label: 'Projetor Grande', hasInfo: true },
  { id: 'notebook', label: 'Notebook' },
  { id: 'passador_slides', label: 'Passador de slides' },
];

export const FURNITURE_SUPPORT_OPTIONS: OptionItem[] = [
  { id: 'cadeiras_extras', label: 'Cadeiras Extras' },
  { id: 'pulpito', label: 'Púlpito' },
  { id: 'toalhas', label: 'Toalhas' },
  { id: 'mesas_grandes', label: 'Mesas grandes' },
  { id: 'sofa', label: 'Sofa' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];

export const SUPPORT_TEAMS_OPTIONS: OptionItem[] = [
  { id: 'administrativo', label: 'Administrativo' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'nap', label: 'Nap' },
  { id: 'secretaria_academica', label: 'Secretaria Acadêmica' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'ti', label: 'TI' },
  { id: 'reitoria', label: 'Reitoria' },
  { id: 'nead', label: 'Nead' },
  { id: 'biblioteca', label: 'Biblioteca' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'pro_comunidade', label: 'Pró Comunidade' },
  { id: 'recursos_humanos', label: 'Recursos Humanos' },
  { id: 'nad', label: 'Nad' },
  { id: 'central_atendimento', label: 'Central de Atendimento' },
  { id: 'bolsas', label: 'Bolsas' },
  { id: 'pos_graduacao', label: 'Pós-graduação' },
  { id: 'colegio_cruz_sousa', label: 'Colégio Cruz e Sousa' },
];

export const PRESENTATION_MATERIAL_OPTIONS: OptionItem[] = [
  { id: 'arquivo_pdf_ppt', label: 'Apresentação (PDF, PPT, etc)' },
  { id: 'arquivo_video', label: 'Vídeo' },
  { id: 'pen_drive', label: 'Levarei Pen Drive (USB)' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];
