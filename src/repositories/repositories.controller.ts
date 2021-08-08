import { Controller, Get, Header, Next, Param, Query } from '@nestjs/common';
import { Accept } from './accept-header.decorator';
import { GetRepositoriesQuery } from './dto/get-repositories.query';
import { RepositoriesService } from './repositories.service';

@Controller('user')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get(':user/repositories')
  @Accept('application/json')
  async findAll(@Param('user') user, @Query() getRepositoriesQuery: GetRepositoriesQuery) {
    return this.repositoriesService.getRepositories(user, getRepositoriesQuery).catch(console.log);
  }
}
