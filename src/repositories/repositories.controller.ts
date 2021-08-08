import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ExceptionResponse } from 'src/config/exception/exception-response';
import { Accept } from './accept-header.decorator';
import { GetRepositoriesQuery } from './dto/get-repositories.query';
import { RepositoriesResponse } from './entities/repositories-response';
import { RepositoriesService } from './repositories.service';

@Controller('user')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get(':user/repositories')
  @ApiTags('Repositories')
  @ApiResponse({
    status: 200,
    type: RepositoriesResponse,
    isArray: true,
    description: 'Get accounting conciliation report',
  })
  @ApiResponse({
    status: 404,
    type: ExceptionResponse,
    description: 'GitHub user not found',
  })
  @ApiResponse({
    status: 406,
    type: ExceptionResponse,
    description: 'Accept type not supported',
  })
  @Accept('application/json')
  async findAll(@Query() getRepositoriesQuery: GetRepositoriesQuery, @Param('user') user: string) {
    return this.repositoriesService.getRepositories(user, getRepositoriesQuery);
  }
}
