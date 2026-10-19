import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../init";
import { UsersService } from "../../users/users.service";

export const usersRouter = router({
  getById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await new UsersService().findById(input.id);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        color: user.color,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }),
});
