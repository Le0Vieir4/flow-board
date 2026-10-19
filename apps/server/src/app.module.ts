import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BoardsModule } from "./boards/boards.module";
import { ColumnsModule } from "./columns/columns.module";
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { CommentsModule } from "./comments/comments.module";
import { ChecklistsModule } from "./checklists/checklists.module";
import { MembersModule } from "./members/members.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
    NotificationsModule,
    RealtimeModule,
    CommentsModule,
    ChecklistsModule,
    MembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // tRPC context handles session auth. NestJS middleware is kept only for
    // OAuth passport initiation/callback routes registered by AuthModule.
  }
}
