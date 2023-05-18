import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostService } from 'src/post/post.service';
import { PostModule } from 'src/post/post.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PostModule, SocketModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
