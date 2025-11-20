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
    BusStopModule,
    DepartureModule,
    EntryModule,
    WorkOrderModule,
    RouteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
