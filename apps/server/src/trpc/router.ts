import { router } from "./init";
import { boardsRouter } from "./routers/boards";
import { columnsRouter } from "./routers/columns";
import { tasksRouter } from "./routers/tasks";
import { authRouter } from "./routers/auth";
import { sharesRouter } from "./routers/shares";
import { notificationsRouter } from "./routers/notifications";

export const appRouter = router({
  boards: boardsRouter,
  columns: columnsRouter,
  tasks: tasksRouter,
  auth: authRouter,
  shares: sharesRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
