import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum RequesterType {
  INTERNO = 'interno',
  LOCACAO = 'locacao',
}

export class CreateEventTicketDto {
  @IsString()
  @IsNotEmpty()
  requesterName: string;

  @IsEmail()
  requesterEmail: string;

  @IsString()
  @IsNotEmpty()
  requesterPhone: string;

  @IsEnum(RequesterType, {
    message: 'requesterType deve ser "interno" ou "locacao"',
  })
  requesterType: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  requesterDepartment?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  adminApprovalFileUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPartnerEvent?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  partnerName?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  partnerPhone?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  partnerInstitution?: string;

  @IsString()
  @IsNotEmpty()
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

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  selectedRoom: string;

  @IsBoolean()
  @IsOptional()
  needsBudget?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  budgetApprovalFileUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  copa?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coffeeBreak?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tiEquipment?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  furnitureSupport?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  supportTeams?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  presentationMaterials?: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  presentationDriveLink?: string;

  @IsBoolean()
  @IsOptional()
  needsArtwork?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  artworkDescription?: string;
}
