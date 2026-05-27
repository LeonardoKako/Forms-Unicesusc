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
import { Type } from 'class-transformer';

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
  requesterDepartment?: string;

  @IsString()
  @IsOptional()
  adminApprovalFileUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPartnerEvent?: boolean;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsEmail()
  @IsOptional()
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  partnerPhone?: string;

  @IsString()
  @IsOptional()
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

  @IsString()
  @IsOptional()
  presentationDriveUrl?: string;

  @IsBoolean()
  @IsOptional()
  needsArtwork?: boolean;

  @IsString()
  @IsOptional()
  artworkDescription?: string;
}
