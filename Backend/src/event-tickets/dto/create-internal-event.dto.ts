import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateInternalEventDto {
  @IsString()
  @IsEnum(['interno'])
  requesterType: string;

  @IsString()
  @MinLength(3, { message: 'requesterName deve ter no mínimo 3 caracteres' })
  requesterName: string;

  @IsEmail({}, { message: 'requesterEmail deve ser um e-mail válido' })
  requesterEmail: string;

  @IsString()
  @MinLength(10, { message: 'requesterPhone deve ter no mínimo 10 dígitos' })
  requesterPhone: string;

  @IsString()
  @MinLength(2, {
    message: 'requesterDepartment deve ter no mínimo 2 caracteres',
  })
  requesterDepartment: string;

  @IsBoolean()
  @IsOptional()
  isPartnerEvent?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  partnerName?: string;

  @IsEmail({}, { message: 'partnerEmail deve ser um e-mail válido' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  partnerPhone?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  partnerInstitution?: string;

  @IsString()
  @MinLength(5, { message: 'eventTitle deve ter no mínimo 5 caracteres' })
  eventTitle: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsNotEmpty()
  eventDescription: string;

  @IsArray()
  @IsString({ each: true })
  targetAudience: string[];

  @IsInt()
  @Min(1)
  @Type(() => Number)
  estimatedPublic: number;

  @IsString()
  @IsNotEmpty()
  eventDate: string; // Formato YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  selectedRoom: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  roomNotes?: string;

  @IsBoolean()
  needsBudget: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  budgetApprovalFileUrl?: string;

  @IsArray()
  @IsString({ each: true })
  copa: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  otherCopaDescription?: string;

  @IsString()
  @IsNotEmpty()
  coffeeBreak: string; // Identificador do plano ou "nao_se_aplica"

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  coffeeNotes?: string;

  @IsArray()
  @IsString({ each: true })
  tiEquipment: string[];

  @IsArray()
  @IsString({ each: true })
  furnitureSupport: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  otherFurnitureDescription?: string;

  @IsArray()
  @IsString({ each: true })
  supportTeams: string[];

  @IsArray()
  @IsString({ each: true })
  presentationMaterials: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  presentationDriveLink?: string;

  @IsBoolean()
  needsArtwork: boolean;

  @IsBoolean()
  @IsOptional()
  hasPrintedArtwork?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  artworkDescription?: string;
}
