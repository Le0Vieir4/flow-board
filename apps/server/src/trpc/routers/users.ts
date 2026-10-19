import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { authedProcedure, router } from "../init";
import { UsersService } from "../../users/users.service";

const usersService = new UsersService();

export const usersRouter = router({
  getById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await usersService.findById(input.id);
      return user;
    }),
});
