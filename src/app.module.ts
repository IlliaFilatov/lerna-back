import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB),
    ConfigModule.forRoot(),
    ProductsModule,
    TwitterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
