import { AcceptGuard } from '@config/accept-header.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EnvironmentConfig } from './config/env.config';
import { HealthController } from './health/health.controller';
import { RepositoriesModule } from './repositories/repositories.module';

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
