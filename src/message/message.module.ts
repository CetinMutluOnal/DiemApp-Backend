import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from 'src/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    NestjsFormDataModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
