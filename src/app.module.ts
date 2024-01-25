import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { ExpiredTokensModule } from './expired-tokens/expired-tokens.module';
import { LikesModule } from './likes/likes.module';
import { MailModule } from './mail/mail.module';
import { NotConfirmedAccountsModule } from './not-confirmed-accounts/not-confirmed-accounts.module';
import { NotRecoveredPasswordsModule } from './not-recovered-passwords/not-recovered-passwords.module';
import { PostsModule } from './posts/posts.module';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { UsersModule } from './users/users.module';

const dbName = 'blog_platform';

const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRoot(mongoURI),
    JwtModule.register({ global: true }),
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
        limit: 20,
      },
    ]),
    BlogsModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    AuthModule,
    MailModule,
    NotConfirmedAccountsModule,
    NotRecoveredPasswordsModule,
    LikesModule,
    SecurityDevicesModule,
    ExpiredTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
