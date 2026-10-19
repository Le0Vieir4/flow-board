import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { authedProcedure, publicProcedure, router } from "../init";
import { db } from "../../db";
import { boardShares } from "../../db/schema";
import { eq } from "drizzle-orm";
import { BoardsService } from "../../boards/boards.service";

const SHARE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export const sharesRouter = router({
  create: authedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const board = await new BoardsService().findOne(input.boardId, ctx.user.id);
      const token = randomBytes(24).toString("base64url");
      await db.insert(boardShares).values({
        boardId: input.boardId,
        token,
        expiresAt: new Date(Date.now() + SHARE_TTL_MS),
      });
      return { token, boardId: board.id };
    }),
  get: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const [share] = await db
        .select()
        .from(boardShares)
        .where(eq(boardShares.token, input.token));
      if (!share || (share.expiresAt && share.expiresAt.getTime() <= Date.now())) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share not found or expired" });
      }
      return new BoardsService().loadBoardDetail(share.boardId);
    }),
});
