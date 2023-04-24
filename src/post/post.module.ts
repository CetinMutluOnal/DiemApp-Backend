import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/schema/post.schema';
import { FollowModule } from 'src/follow/follow.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    NestjsFormDataModule,
    FollowModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
