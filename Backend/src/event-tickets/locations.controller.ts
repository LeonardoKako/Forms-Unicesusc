import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExternalLocationDto: CreateExternalLocationDto) {
    return this.locationsService.createExternal(createExternalLocationDto);
  }

  // --- Endpoints de verificação JWT ---
  // IMPORTANTE: Devem vir ANTES dos endpoints :id para evitar conflito de rotas

  @Get('verify-author')
  verifyAuthor(@Query('token') token: string) {
    return this.locationsService.verifyLocationAuthor(token);
  }

  @Get('admin-review')
  getAdminReview(@Query('token') token: string) {
    return this.locationsService.getLocationAdminReview(token);
  }

  @Post('admin-review')
  @HttpCode(HttpStatus.OK)
  submitAdminReview(
    @Body() body: { token: string; approved: boolean; reason?: string },
  ) {
    return this.locationsService.submitLocationAdminReview(
      body.token,
      body.approved,
      body.reason,
    );
  }

  @Get()
  findAll() {
    return this.locationsService.findAllLocations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOneLocation(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.locationsService.removeLocation(id);
  }
}
