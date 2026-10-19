import { z } from "zod";
import { authedProcedure, router } from "../init";
import { NotificationsService } from "../../notifications/notifications.service";

export const notificationsRouter = router({
  getAll: authedProcedure.query(async ({ ctx }) => {
    return new NotificationsService().findAll(ctx.user.id);
  }),
  unreadCount: authedProcedure.query(async ({ ctx }) => {
    return new NotificationsService().unreadCount(ctx.user.id);
  }),
  markRead: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await new NotificationsService().markRead(input.id, ctx.user.id);
      return { ok: true };
    }),
  markAllRead: authedProcedure.mutation(async ({ ctx }) => {
    await new NotificationsService().markAllRead(ctx.user.id);
    return { ok: true };
  }),
});
