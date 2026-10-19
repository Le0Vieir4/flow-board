import { Module } from "@nestjs/common";
import { RealtimeService } from "./realtime.service";
import { BoardsModule } from "../boards/boards.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [BoardsModule, NotificationsModule, UsersModule],
  providers: [RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
