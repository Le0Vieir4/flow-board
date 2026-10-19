import { z } from "zod";
import { authedProcedure, router } from "../init";
import { MembersService } from "../../members/members.service";

const membersService = new MembersService();

export const membersRouter = router({
  getAll: authedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input }) => {
      return membersService.listMembers(input.boardId, ctx.user.id);
    }),
  add: authedProcedure
    .input(z.object({ boardId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return membersService.addMember(input.boardId, ctx.user.id, input.userId);
    }),
  remove: authedProcedure
    .input(z.object({ boardId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await membersService.removeMember(input.boardId, ctx.user.id, input.userId);
      return { ok: true };
    }),
});
