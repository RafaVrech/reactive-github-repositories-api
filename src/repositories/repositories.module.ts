import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RepositoriesController } from './controllers/repositories.controller';
import { RepositoriesService } from './services/repositories.service';
import { RepositoriesClient } from './clients/repository.client';

@Module({
  imports: [HttpModule],
  controllers: [RepositoriesController],
  providers: [RepositoriesClient, RepositoriesService]
})
export class RepositoriesModule {}
