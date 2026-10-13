import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from "@nestjs/common";
import * as passport from "passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { configurePassport, githubConfigured, googleConfigured } from "./passport";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule, OnModuleInit {
  onModuleInit() {
    configurePassport();
  }

  configure(consumer: MiddlewareConsumer) {
    if (googleConfigured()) {
      consumer.apply(passport.authenticate("google", { session: false })).forRoutes("auth/google");
      consumer.apply(passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" })).forRoutes("auth/google/callback");
    }
    if (githubConfigured()) {
      consumer.apply(passport.authenticate("github", { session: false })).forRoutes("auth/github");
      consumer.apply(passport.authenticate("github", { session: false, failureRedirect: "/api/auth/github/failure" })).forRoutes("auth/github/callback");
    }
  }
}
