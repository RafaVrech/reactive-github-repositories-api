import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RepositoriesController } from './controllers/repositories.controller';
import { RepositoriesService } from './services/repositories.service';
import { RepositoriesClient } from './clients/repositories.client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, RepositoriesClient]
})
export class RepositoriesModule {}
