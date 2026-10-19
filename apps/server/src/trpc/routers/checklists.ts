import { z } from "zod";
import { authedProcedure, router } from "../init";
import { ChecklistsService } from "../../checklists/checklists.service";

const checklistsService = new ChecklistsService();

export const checklistsRouter = router({
  set: authedProcedure
    .input(z.object({ taskId: z.number().int(), done: z.number().int().min(0), total: z.number().int().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return checklistsService.set(input.taskId, ctx.user.id, {
        done: input.done,
        total: input.total,
      });
    }),
  get: authedProcedure
    .input(z.object({ taskId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return checklistsService.get(input.taskId, ctx.user.id);
    }),
});
