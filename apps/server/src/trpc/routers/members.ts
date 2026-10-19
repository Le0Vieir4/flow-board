import { z } from "zod";
import { authedProcedure, router } from "../init";
import { MembersService } from "../../members/members.service";

export const membersRouter = router({
  getAll: authedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input }) => {
      return new MembersService().listMembers(input.boardId, ctx.user.id);
    }),
  add: authedProcedure
    .input(z.object({ boardId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return new MembersService().addMember(input.boardId, ctx.user.id, input.userId);
    }),
  remove: authedProcedure
    .input(z.object({ boardId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await new MembersService().removeMember(input.boardId, ctx.user.id, input.userId);
      return { ok: true };
    }),
});
