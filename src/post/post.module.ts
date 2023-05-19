import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/schema/post.schema';
import { FollowModule } from 'src/follow/follow.module';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/schema/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    NestjsFormDataModule,
    FollowModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
