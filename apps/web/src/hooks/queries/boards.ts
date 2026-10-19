import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Board, Column, CreateTask, Task, UpdateBoard } from "@flow/shared";
import { trpcClient } from "@/lib/trpc/client";

export const BOARDS_KEY = ["boards"];
export function boardKey(id: string) {
  return ["board", id];
}

export function useBoards() {
  return useQuery<Board[]>({
    queryKey: BOARDS_KEY,
    queryFn: () => trpcClient.boards.getAll.query() as Promise<Board[]>,
  });
}

export function useBoard(id: string | undefined) {
  return useQuery<Board>({
    queryKey: boardKey(id ?? ""),
    queryFn: () => trpcClient.boards.getById.query({ id: id! }) as Promise<Board>,
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => trpcClient.boards.create.mutate({ name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useUpdateBoard(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: UpdateBoard) =>
      trpcClient.boards.update.mutate({ id: boardId, ...patch }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOARDS_KEY });
      qc.invalidateQueries({ queryKey: boardKey(boardId) });
    },
  });
}

export function useDeleteBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trpcClient.boards.remove.mutate({ id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useDuplicateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trpcClient.boards.duplicate.mutate({ id }),
    onSuccess: (dup) => {
      qc.invalidateQueries({ queryKey: BOARDS_KEY });
      return dup;
    },
  });
}

export function useAddColumn(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => trpcClient.columns.create.mutate({ boardId, name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOARDS_KEY });
      qc.invalidateQueries({ queryKey: boardKey(boardId) });
    },
  });
}

export function useUpdateColumn(columnId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => trpcClient.columns.update.mutate({ id: columnId, name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useDeleteColumn(columnId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => trpcClient.columns.remove.mutate({ id: columnId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useAddTask(columnId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreateTask, "columnId">) =>
      trpcClient.tasks.create.mutate({ columnId, ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useUpdateTask(taskId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Task>) => {
      const { id: _id, comments: _comments, ...rest } = input;
      return trpcClient.tasks.update.mutate({ id: taskId, ...(rest as Record<string, unknown>) });
    },
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: BOARDS_KEY });
      const previous = qc.getQueryData<Board[]>(BOARDS_KEY);
      qc.setQueryData<Board[]>(BOARDS_KEY, (old) => {
        if (!old) return old;
        return old.map((b) =>
          b.columns.flatMap((c: Column) => c.tasks).some((t: Task) => t.id === taskId)
            ? {
                ...b,
                columns: b.columns.map((c: Column) => ({
                  ...c,
                  tasks: c.tasks.map((t: Task) => (t.id === taskId ? { ...t, ...input } : t)),
                })),
              }
            : b
        );
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData<Board[]>(BOARDS_KEY, context?.previous);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => trpcClient.tasks.remove.mutate({ id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOARDS_KEY }),
  });
}

export function useMoveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables: { boardId: string; taskId: number; toColumnId: string }) =>
      trpcClient.tasks.move.mutate(variables),
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: BOARDS_KEY });
      const previous = qc.getQueryData<Board[]>(BOARDS_KEY);
      qc.setQueryData<Board[]>(BOARDS_KEY, (old) => {
        if (!old) return old;
        return old.map((b) => {
          if (b.id !== variables.boardId) return b;
          let moved: Task | undefined;
          const columns = b.columns.map((c: Column) => {
            const found = c.tasks.find((t: Task) => t.id === variables.taskId);
            if (found) {
              moved = found;
              return { ...c, tasks: c.tasks.filter((t: Task) => t.id !== variables.taskId) };
            }
            return c;
          });
          if (!moved) return { ...b, columns };
          return {
            ...b,
            columns: columns.map((c: Column) =>
              c.id === variables.toColumnId ? { ...c, tasks: [...c.tasks, moved as Task] } : c
            ),
          };
        });
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData<Board[]>(BOARDS_KEY, context?.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });
}

export const COMMENTS_KEY = (taskId: number) => ["comments", taskId];

export function useComments(taskId: number) {
  return useQuery({
    queryKey: COMMENTS_KEY(taskId),
    queryFn: () => trpcClient.comments.getAll.query({ taskId }),
    enabled: !!taskId,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { taskId: number; body: string }) =>
      trpcClient.comments.create.mutate(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: COMMENTS_KEY(input.taskId) });
      const previous = qc.getQueryData(COMMENTS_KEY(input.taskId));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData(COMMENTS_KEY(_vars.taskId), context?.previous);
    },
    onSettled: (_data, _error, input) => {
      qc.invalidateQueries({ queryKey: COMMENTS_KEY(input.taskId) });
    },
  });
}

export const CHECKLIST_KEY = (taskId: number) => ["checklist", taskId];

export function useChecklist(taskId: number) {
  return useQuery({
    queryKey: CHECKLIST_KEY(taskId),
    queryFn: () => trpcClient.checklists.get.query({ taskId }),
    enabled: !!taskId,
  });
}

export function useSetChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { taskId: number; done: number; total: number }) =>
      trpcClient.checklists.set.mutate(input),
    onSuccess: (_data, input) => {
      qc.invalidateQueries({ queryKey: CHECKLIST_KEY(input.taskId) });
    },
  });
}

export const MEMBERS_KEY = (boardId: string) => ["members", boardId];

export function useMembers(boardId: string) {
  return useQuery({
    queryKey: MEMBERS_KEY(boardId),
    queryFn: () => trpcClient.members.getAll.query({ boardId }),
    enabled: !!boardId,
  });
}

export function useAddMember(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => trpcClient.members.add.mutate({ boardId, userId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBERS_KEY(boardId) });
      qc.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}

export function useRemoveMember(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => trpcClient.members.remove.mutate({ boardId, userId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MEMBERS_KEY(boardId) });
      qc.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
