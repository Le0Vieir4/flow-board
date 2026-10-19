import { z } from "zod";
import { authedProcedure, router } from "../init";
import { CreateTask, MoveTask, UpdateTask } from "@flow/shared";
import { TasksService } from "../../tasks/tasks.service";

const tasksService = new TasksService();

export const tasksRouter = router({
  create: authedProcedure.input(CreateTask).mutation(async ({ ctx, input }) => {
    return tasksService.create(input.columnId, ctx.user.id, {
      title: input.title,
      description: input.description,
      tag: input.tag,
      assignees: input.assignees,
      dueDate: input.dueDate,
      position: input.position,
    });
  }),
  update: authedProcedure
    .input(UpdateTask.merge(z.object({ id: z.number().int() })))
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input;
      return tasksService.update(id, ctx.user.id, patch);
    }),
  remove: authedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await tasksService.remove(input.id, ctx.user.id);
      return { ok: true };
    }),
  move: authedProcedure.input(MoveTask).mutation(async ({ ctx, input }) => {
    return tasksService.move(input.boardId, input.taskId, input.toColumnId, ctx.user.id);
  }),
});
