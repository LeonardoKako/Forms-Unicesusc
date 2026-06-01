export interface RoomOption {
  value: string;
  label: string;
  capacity: number;
  location: string;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    value: "campus",
    label: "Campus",
    capacity: 1700,
    location: "Área Externa",
  },
  {
    value: "auditorio",
    label: "Auditório Principal",
    capacity: 228,
    location: "Bloco A",
  },
  {
    value: "sala_aula_40",
    label: "Sala de Aula",
    capacity: 40,
    location: "Blocos Diversos",
  },
  {
    value: "sala_aula_60",
    label: "Sala de Aula",
    capacity: 60,
    location: "Blocos Diversos",
  },
  {
    value: "ginasio_esportes",
    label: "Ginásio de Esportes",
    capacity: 500,
    location: "Ginásio",
  },
  { value: "colegio", label: "Colégio", capacity: 300, location: "Colégio" },
  {
    value: "lab_info",
    label: "Laboratório de Informática",
    capacity: 30,
    location: "Bloco B",
  },
];

export interface OptionItem {
  id: string;
  label: string;
  hasInfo?: boolean;
}

export const TARGET_AUDIENCE_OPTIONS: OptionItem[] = [
  { id: "aberto_publico", label: "Evento aberto ao público" },
  { id: "externo", label: "Evento externo" },
  { id: "colaboradores", label: "Evento exclusivo para Colaboradores" },
  { id: "alunos", label: "Evento exclusivo para alunos" },
  { id: "docentes", label: "Evento exclusivo para Docentes" },
  { id: "nao_se_aplica", label: "Não se aplica" },
];

export const COPA_OPTIONS: OptionItem[] = [
  { id: "espatula_bolo", label: "Espátula para bolo" },
  { id: "faca_bolo", label: "Faca p/ bolo" },
  { id: "guardanapo_suporte", label: "Guardapano c/ suporte" },
  { id: "jarra_suco", label: "Jarra p/ suco (disponível somente 2 unidades - informar quantidade)" },
  { id: "tacas_padrao", label: "Taças padrão (disponível somente 10 unidades - informar quantidade)" },
  { id: "boleira_com_base", label: "Boleira com base (disponível somente 2 unidades - informar quantidade)" },
  { id: "boleira_sem_base", label: "1 boleira sem base" },
  { id: "bandeja_quadrada", label: "Bandeja quadrada (disponível somente 2 unidades - informar quantidade)" },
  { id: "bandeja_retangular", label: "Bandeja retangula (disponíveis somente 2 unidades - informar quantidade)" },
  { id: "toalha", label: "Toalha (informar quantidade)" },
  { id: "outro", label: "Outros" },
  { id: "nao_se_aplica", label: "Não será preciso/não se aplica." },
];

export const COFFEE_BREAK_OPTIONS: OptionItem[] = [
  { id: "cafe", label: "Café" },
  { id: "biscoito_maizena", label: "Biscoito Maizena" },
  { id: "salgadinhos", label: "Salgadinhos" },
  { id: "agua", label: "Água" },
  { id: "nao_se_aplica", label: "Não será preciso/não se aplica" },
];

export const TI_EQUIPMENT_OPTIONS: OptionItem[] = [
  { id: "microfones", label: "Microfones" },
  { id: "projetor_pequeno", label: "Projetor Pequeno", hasInfo: true },
  { id: "projetor_grande", label: "Projetor Grande", hasInfo: true },
  { id: "notebook", label: "Notebook" },
  { id: "passador_slides", label: "Passador de slides" },
  { id: "nao_se_aplica", label: "Não se aplica" },
];

export const FURNITURE_SUPPORT_OPTIONS: OptionItem[] = [
  { id: "cadeiras_cinza", label: "Cadeiras cinza padrão (disponível somente 10 unidades - informar quantidade)" },
  { id: "mesas_grandes", label: "Mesas grandes (disponível somente 4 unidades - informar quantidade)" },
  { id: "mesas_apoio_sala", label: "Mesas de apoio padrão sala de aula retangulares (disponível somente 4 unidades - informar quantidade)" },
  { id: "poltrona_bordo", label: "Poltrona bordô (1 unidade)" },
  { id: "puff_cinza", label: "Puff cinza (1 unidade)" },
  { id: "palco_padrao", label: "Palco padrão montado (1 sofá preto, 2 poltronas pretas, 2 puffs roxos, 1 púlpito)", hasInfo: true },
  { id: "outro", label: "Outros" },
  { id: "nao_se_aplica", label: "Não será preciso/não se aplica." },
];

export const SUPPORT_TEAMS_OPTIONS: OptionItem[] = [
  { id: "administrativo", label: "Administrativo" },
  { id: "financeiro", label: "Financeiro" },
  { id: "nap", label: "Nap" },
  { id: "secretaria_academica", label: "Secretaria Acadêmica" },
  { id: "comercial", label: "Comercial" },
  { id: "manutencao", label: "Manutenção" },
  { id: "ti", label: "TI" },
  { id: "reitoria", label: "Reitoria" },
  { id: "nead", label: "Nead" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "marketing", label: "Marketing" },
  { id: "pro_comunidade", label: "Pró Comunidade" },
  { id: "recursos_humanos", label: "Recursos Humanos" },
  { id: "nad", label: "Nad" },
  { id: "central_atendimento", label: "Central de Atendimento" },
  { id: "bolsas", label: "Bolsas" },
  { id: "pos_graduacao", label: "Pós-graduação" },
  { id: "colegio_cruz_sousa", label: "Colégio Cruz e Sousa" },
];

export const PRESENTATION_MATERIAL_OPTIONS: OptionItem[] = [
  { id: "google_drive_link", label: "Link do Google Drive" },
  { id: "pen_drive", label: "Levarei Pen Drive (USB)" },
  { id: "nao_se_aplica", label: "Não se aplica" },
];
