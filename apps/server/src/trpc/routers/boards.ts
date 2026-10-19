import { z } from "zod";
import { authedProcedure, router } from "../init";
import { CreateBoard, UpdateBoard } from "@flow/shared";
import { BoardsService } from "../../boards/boards.service";

export const boardsRouter = router({
  getAll: authedProcedure.query(async ({ ctx }) => {
    return new BoardsService().findAll(ctx.user.id);
  }),
  getById: authedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return new BoardsService().findOne(input.id, ctx.user.id);
  }),
  create: authedProcedure.input(CreateBoard).mutation(async ({ ctx, input }) => {
    return new BoardsService().create(input, ctx.user.id);
  }),
  update: authedProcedure
    .input(UpdateBoard.merge(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input;
      return new BoardsService().update(id, ctx.user.id, patch);
    }),
  remove: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await new BoardsService().remove(input.id, ctx.user.id);
      return { ok: true };
    }),
  duplicate: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return new BoardsService().duplicate(input.id, ctx.user.id);
    }),
});
