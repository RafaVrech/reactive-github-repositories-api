import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AcceptGuard } from './repositories/accept-header.guard';
import { RepositoriesModule } from './repositories/repositories.module';
import { HealthController } from './health/health.controller';
import { EnvironmentConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvironmentConfig.mapping],
    }),
    RepositoriesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AcceptGuard,
    },
  ],
})
export class AppModule {}
