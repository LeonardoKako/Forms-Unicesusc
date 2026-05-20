export interface RoomOption {
  value: string
  label: string
  capacity: number
  location: string
}

export const ROOM_OPTIONS: RoomOption[] = [
  { value: 'auditorio', label: 'Auditório Principal (Térreo)', capacity: 180, location: 'Bloco A - Térreo' },
  { value: 'conferencia', label: 'Sala de Conferências Executiva', capacity: 40, location: 'Bloco C - 2º Andar' },
  { value: 'lab_info_1', label: 'Laboratório de Informática I', capacity: 30, location: 'Bloco B - 1º Andar' },
  { value: 'lab_info_2', label: 'Laboratório de Informática II', capacity: 30, location: 'Bloco B - 1º Andar' },
  { value: 'sala_multimidia_1', label: 'Sala Multimídia 102', capacity: 50, location: 'Bloco A - 1º Andar' },
  { value: 'sala_multimidia_2', label: 'Sala Multimídia 204', capacity: 60, location: 'Bloco A - 2º Andar' },
  { value: 'arena_inovacao', label: 'Arena de Inovação e Cocriação', capacity: 80, location: 'Bloco D - Térreo' },
]

export interface OptionItem {
  id: string;
  label: string;
}

export const TARGET_AUDIENCE_OPTIONS: OptionItem[] = [
  { id: 'aberto_publico', label: 'Evento aberto ao público' },
  { id: 'externo', label: 'Evento externo' },
  { id: 'colaboradores', label: 'Evento exclusivo para Colaboradores' },
  { id: 'alunos', label: 'Evento exclusivo para alunos' },
  { id: 'docentes', label: 'Evento exclusivo para Docentes' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];

export const COFFEE_BREAK_OPTIONS: OptionItem[] = [
  { id: 'cafe_2_termicas', label: 'Café (2 térmicas)' },
  { id: 'guardanapo', label: 'Guardanapo' },
  { id: 'tacas', label: 'Taças' },
  { id: 'nao_se_aplica', label: 'Não será preciso/não se aplica' },
];

export const TI_EQUIPMENT_OPTIONS: OptionItem[] = [
  { id: 'microfones', label: 'Microfones' },
  { id: 'projetor', label: 'Projetor' },
  { id: 'nao_se_aplica', label: 'Não se aplica' },
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
  { id: 'nao_se_aplica', label: 'Não se aplica' },
];
