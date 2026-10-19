import { router } from "./init";
import { boardsRouter } from "./routers/boards";
import { columnsRouter } from "./routers/columns";
import { tasksRouter } from "./routers/tasks";
import { authRouter } from "./routers/auth";
import { sharesRouter } from "./routers/shares";
import { notificationsRouter } from "./routers/notifications";
import { commentsRouter } from "./routers/comments";
import { checklistsRouter } from "./routers/checklists";
import { membersRouter } from "./routers/members";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  boards: boardsRouter,
  columns: columnsRouter,
  tasks: tasksRouter,
  auth: authRouter,
  shares: sharesRouter,
  notifications: notificationsRouter,
  comments: commentsRouter,
  checklists: checklistsRouter,
  members: membersRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
