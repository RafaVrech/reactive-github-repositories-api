import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetRepositoriesQuery } from './dto/get-repositories.query';
import { RepositoriesService } from './repositories.service';

@Controller('user')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get(':user/repositories')
  findAll(@Param('user') user, @Query() getRepositoriesQuery: GetRepositoriesQuery) {
    return this.repositoriesService.getRepositories(user, getRepositoriesQuery);
  }
}
