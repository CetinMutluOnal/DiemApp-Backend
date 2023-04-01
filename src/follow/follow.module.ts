import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema } from 'src/schema/follow.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
  ],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
