import { notFound } from "next/navigation";
import { trpcFetch } from "@/lib/api";

type ShareTask = {
  id: number;
  label: string;
  title: string;
  description: string | null;
  tag: string | null;
  assignees: string[];
  dueDate: string | null;
};

type ShareColumn = {
  id: string;
  name: string;
  position: number;
  tasks: ShareTask[];
};

type ShareBoard = {
  id: string;
  name: string;
  idPrefix: string;
  columns: ShareColumn[];
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let board: ShareBoard;
  try {
    const { result } = await trpcFetch<ShareBoard>("shares.get", { token });
    board = result;
  } catch {
    notFound();
  }
  if (!board) notFound();

  const TAG_COLORS: Record<string, string> = {
    electric: "#3b5bff",
    design: "#6a4fd6",
    high: "#c24545",
    medium: "#9c6327",
    low: "#217a4d",
  };

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary-gradient">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path d="M4 4h16M4 12h11M4 20h7" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h1 className="text-stub-heading">{board.name}</h1>
            <p className="text-meta text-muted-foreground">Read-only board shared via {board.idPrefix}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {board.columns.map((column) => (
            <div key={column.id} className="w-[272px] flex-shrink-0 rounded-lg border border-line bg-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-label font-medium">{column.name}</h3>
                <span className="text-[10px] text-muted-foreground">{column.tasks.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-badge border border-line bg-card p-3 mb-2"
                  >
                    <span className="text-[10.5px] text-muted-foreground block mb-1">{task.label}</span>
                    <div className="text-label font-medium truncate">{task.title}</div>
                    {task.tag && (
                      <span
                        className="inline-flex items-center rounded-badge px-2 py-[1px] text-[10px] font-semibold text-white mt-1"
                        style={{ backgroundColor: TAG_COLORS[task.tag] }}
                      >
                        {task.tag}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[10px] text-muted-foreground mt-1 block">{task.dueDate}</span>
                    )}
                  </div>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-[11px] text-muted-foreground">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          This is a read-only shared view. Sign in to edit.
        </p>
      </div>
    </div>
  );
}
