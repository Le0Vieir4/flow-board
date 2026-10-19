import { z } from "zod";
import { authedProcedure, router } from "../init";
import { CommentsService } from "../../comments/comments.service";

export const commentsRouter = router({
  getAll: authedProcedure
    .input(z.object({ taskId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return new CommentsService().findAll(input.taskId, ctx.user.id);
    }),
  create: authedProcedure
    .input(z.object({ taskId: z.number().int(), body: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      return new CommentsService().create({
        taskId: input.taskId,
        userId: ctx.user.id,
        body: input.body,
      });
    }),
});
