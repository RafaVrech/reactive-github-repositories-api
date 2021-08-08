import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AcceptGuard } from './repositories/accept-header.guard';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AcceptGuard,
    },
  ],
})
export class AppModule {}
