import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { CurrencyTypeModule } from './currency_type/currency_type.module';
import { OrderModule } from './order/order.module';
import { StatusModule } from './status/status.module';
import { OperationModule } from './operation/operation.module';
import cookieParser from 'cookie-parser';
import * as session from "express-session"

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}), MongooseModule.forRoot(process.env.MONGO_URI), AdminModule, CurrencyTypeModule, OrderModule, StatusModule, OperationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
