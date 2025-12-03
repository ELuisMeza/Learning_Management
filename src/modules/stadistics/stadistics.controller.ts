import { Controller, HttpStatus, Get, HttpCode } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('stadistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)  
@Controller('stadistics')
export class StadisticsController {
  constructor(private readonly stadisticsService: StadisticsService) {}
  
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener estadísticas de la aplicación' })
  @ApiOkResponse({ description: 'Estadísticas de la aplicación' })
  async getStadistics() {
    return await this.stadisticsService.getStadistics();
  }
  
}
