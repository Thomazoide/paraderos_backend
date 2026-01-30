import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from './config/db.config';
import { BusStopModule } from './modules/bus-stop.module';
import { DepartureModule } from './modules/departure.module';
import { EntryModule } from './modules/entry.module';
import { WorkOrderModule } from './modules/work-order.module';
import { RouteModule } from './modules/route.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { VisitFormModule } from './modules/visit-form.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/passport.guard';
import { ReportModule } from './modules/report.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    AuthModule,
    BusStopModule,
    DepartureModule,
    EntryModule,
    WorkOrderModule,
    RouteModule,
    UserModule,
    VisitFormModule,
    ReportModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
