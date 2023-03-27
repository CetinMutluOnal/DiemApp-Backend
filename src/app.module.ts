import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PostSchema } from './schema/post.schema';
@Module({
  imports: [
    NestjsFormDataModule,
    JwtModule.register({}),
    ConfigModule.forRoot({}),
    MongooseModule.forRoot('mongodb://localhost:27019', {
      dbName: 'diemSocial',
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
  ],
  controllers: [AppController, UserController, PostController],
  providers: [AppService, UserService, PostService],
})
export class AppModule {}
