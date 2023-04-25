import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeSchema } from 'src/schema/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Like',
        schema: LikeSchema,
      },
    ]),
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
