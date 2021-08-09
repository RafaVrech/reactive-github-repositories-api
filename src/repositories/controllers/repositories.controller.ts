import { Accept } from '@config/accept-header.decorator';
import { ExceptionResponse } from '@config/exception/exception-response';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepositoriesResponse } from '../services/entities/repositories.response';
import { RepositoriesService } from '../services/repositories.service';
import { GetRepositoriesQuery } from './queries/get-repositories.query';

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
  findAll(@Param('user') user: string, @Query() getRepositoriesQuery?: GetRepositoriesQuery) {
    return this.repositoriesService.getRepositories(user, getRepositoriesQuery);
  }
}
