import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExternalLocationDto {
  @IsString()
  @IsEnum(['locacao'])
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
  @Transform(({ value }) => value === '' ? undefined : value)
  roomNotes?: string;

  @IsArray()
  @IsString({ each: true })
  supportTeams: string[];
}
