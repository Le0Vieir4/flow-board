import { z } from "zod";
import { authedProcedure, router } from "../init";
import { CreateColumn, UpdateColumn } from "@flow/shared";
import { ColumnsService } from "../../columns/columns.service";

export const columnsRouter = router({
  create: authedProcedure.input(CreateColumn).mutation(async ({ ctx, input }) => {
    return new ColumnsService().create(input.boardId, ctx.user.id, input.name);
  }),
  update: authedProcedure
    .input(UpdateColumn.merge(z.object({ id: z.string(), name: z.string().min(1).max(100) })))
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input;
      return new ColumnsService().update(id, ctx.user.id, patch.name);
    }),
  remove: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await new ColumnsService().remove(input.id, ctx.user.id);
      return { ok: true };
    }),
});
