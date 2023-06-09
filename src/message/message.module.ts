import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from 'src/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    NestjsFormDataModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
