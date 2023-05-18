import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { MessageModule } from './message/message.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketModule } from './socket/socket.module';
import { FeedModule } from './feed/feed.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27019', {
      dbName: 'diemSocial',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    UserModule,
    PostModule,
    FollowModule,
    MessageModule,
    LikeModule,
    CommentModule,
    SocketModule,
    FeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
