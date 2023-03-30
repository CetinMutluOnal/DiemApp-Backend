import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PostSchema } from './schema/post.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forRoot('mongodb://localhost:27019', {
      dbName: 'diemSocial',
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService, PostService],
})
export class AppModule {}
