import { useState } from "react";
import { createBoard } from "@/lib/boards-store";
import { Icons } from "@flow/ui/icons";
import { openNewBoard } from "@/lib/commands";
import { addColumn, nextTaskId, boardsState } from "@/lib/boards-store";

const TEMPLATE_DEFINITIONS = [
  {
    id: "project-sprint",
    name: "Project Sprint",
    description: "Standard sprint workflow with backlog, planning, and review",
    iconName: "kanban",
    columns: [
      { name: "Backlog", sampleTasks: [
        { title: "Define project scope", tag: "electric" },
        { title: "Set up CI/CD pipeline", tag: "high" },
        { title: "Write API documentation", tag: "medium" },
      ]},
      { name: "Sprint Planning", sampleTasks: [
        { title: "Prioritize user stories", tag: "high" },
        { title: "Estimate story points", tag: "medium" },
      ]},
      { name: "In Progress", sampleTasks: [] },
      { name: "In Review", sampleTasks: [] },
      { name: "Done", sampleTasks: [] },
    ],
  },
  {
    id: "personal-kanban",
    name: "Personal Kanban",
    description: "Simple personal workflow: Inbox → This Week → Today → Done",
    iconName: "user",
    columns: [
      { name: "Inbox", sampleTasks: [
        { title: "Reply to emails", tag: "low" },
        { title: "Read saved articles", tag: "low" },
      ]},
      { name: "This Week", sampleTasks: [
        { title: "Finish project proposal", tag: "high" },
        { title: "Call dentist", tag: "medium" },
      ]},
      { name: "Today", sampleTasks: [
        { title: "Morning workout", tag: "high" },
        { title: "Team standup", tag: "medium" },
      ]},
      { name: "Done", sampleTasks: [] },
    ],
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    description: "Plan and track content from idea to publish",
    iconName: "calendar",
    columns: [
      { name: "Ideas", sampleTasks: [
        { title: "Q4 blog post topics", tag: "electric" },
        { title: "Case study: customer success", tag: "design" },
        { title: "Newsletter refresh", tag: "medium" },
      ]},
      { name: "Drafting", sampleTasks: [] },
      { name: "Review", sampleTasks: [] },
      { name: "Scheduled", sampleTasks: [] },
      { name: "Published", sampleTasks: [] },
    ],
  },
  {
    id: "support-queue",
    name: "Support Queue",
    description: "Triage, track and resolve support tickets",
    iconName: "users",
    columns: [
      { name: "Triage", sampleTasks: [
        { title: "Login issue report", tag: "high" },
        { title: "Feature request: dark mode", tag: "low" },
      ]},
      { name: "In Progress", sampleTasks: [] },
      { name: "Waiting on Customer", sampleTasks: [] },
      { name: "Resolved", sampleTasks: [] },
    ],
  },
];

function renderTemplateIcon(iconName: string) {
  switch (iconName) {
    case "kanban":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M9 9v11" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
          <path d="M4 4h16M4 12h11M4 20h7" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 8.5a3 3 0 100-6 3 3 0 000 6zM21.5 20c0-2.9-2.1-5.3-4.9-5.9" />
        </svg>
      );
    default:
      return null;
  }
}

function TemplatePickerContent({ onClose, onTemplateSelected }: { onClose: () => void; onTemplateSelected: (boardId: string) => void }) {
  const [_selectedTemplate, setSelectedTemplate] = useState<unknown>(null);
  
  function handleSelect(template: Record<string, unknown>) {
    setSelectedTemplate(template);
    
    // Create board with template name
    const board = createBoard(template.name as string);
    
    // Get the newly created board from the store
    const newBoard = boardsState.boards.find((b: { id: string }) => b.id === board.id);
    
    if (newBoard) {
      // Update first column with template's first column
      newBoard.columns[0] = { ...newBoard.columns[0], name: (template.columns as Array<{ name: string }>)[0].name };
      
      // Add sample tasks to first column
      if ((template.columns as Array<{ sampleTasks?: Array<{ title: string; tag?: string; description?: string }> }>)[0].sampleTasks) {
        (template.columns as Array<{ sampleTasks?: Array<{ title: string; tag?: string; description?: string }> }>)[0].sampleTasks!.forEach((task: { title: string; tag?: string; description?: string }) => {
          const taskId = nextTaskId(newBoard);
          const label = newBoard.idPrefix + "-" + (newBoard.columns[0].tasks.length + 1);
          newBoard.columns[0].tasks.push({
            id: taskId,
            label,
            title: task.title,
            tag: task.tag as "electric" | "high" | "medium" | "low" | "design" | undefined,
            description: task.description,
            assignees: [],
            createdAt: new Date().toISOString(),
          });
        });
      }
      
      // Add remaining columns with sample tasks
      for (let i = 1; i < (template.columns as Array<{ name: string; sampleTasks?: Array<{ title: string; tag?: string; description?: string }> }>).length; i++) {
        const col = (template.columns as Array<{ name: string; sampleTasks?: Array<{ title: string; tag?: string; description?: string }> }>)[i];
        addColumn(board.id, col.name);
        
        // Get the added column and add sample tasks
        const updatedBoard = boardsState.boards.find((b: { id: string }) => b.id === board.id);
        if (updatedBoard && col.sampleTasks) {
          const addedCol = updatedBoard.columns.find((c: { name: string }) => c.name === col.name);
          if (addedCol && col.sampleTasks) {
            col.sampleTasks.forEach((task: { title: string; tag?: string; description?: string }) => {
              const taskId = nextTaskId(updatedBoard);
              const label = updatedBoard.idPrefix + "-" + (addedCol.tasks.length + 1);
              addedCol.tasks.push({
                id: taskId,
                label,
                title: task.title,
                tag: task.tag as "electric" | "high" | "medium" | "low" | "design" | undefined,
                description: task.description,
                assignees: [],
                createdAt: new Date().toISOString(),
              });
            });
          }
        }
      }
    }
    
    onClose();
    onTemplateSelected(board.id);
  }

  const templateCards = TEMPLATE_DEFINITIONS.map((template) => (
    <button
      key={template.id}
      type="button"
      onClick={() => handleSelect(template)}
      className="group flex flex-col items-start gap-2 rounded-[12px] border border-line bg-panel p-4 text-left transition-all duration-150 hover:border-primary-2/50 hover:bg-primary/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-panel-2 text-primary group-hover:bg-primary/20">
        {renderTemplateIcon(template.iconName)}
      </div>
      <div>
        <h3 className="text-[13.5px] font-semibold">{template.name}</h3>
        <p className="text-[12px] text-muted-foreground line-clamp-2">{template.description}</p>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icons.PlusIcon size={12} />
        <span>{template.columns.length} columns</span>
      </div>
    </button>
  ));

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold -tracking-[0.01em]">Choose a template</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          aria-label="Close template picker"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} width="18" height="18">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-body text-muted mb-6">
        Start with a template tailored to your workflow. All columns and sample tasks are fully editable.
      </p>
<div className="grid grid-cols-2 gap-3 mb-4">
          {templateCards}
        </div>
      <p className="text-center text-[12px] text-muted-foreground">
        Or{" "}
        <button
          type="button"
          onClick={() => {
            onClose();
            openNewBoard();
          }}
          className="text-link font-semibold hover:underline"
        >
          start from scratch
        </button>
      </p>
    </div>
  );
}

export function TemplatePicker({ onClose, onTemplateSelected }: { onClose: () => void; onTemplateSelected: (boardId: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="Dismiss dialog"
        className="absolute inset-0 cursor-default bg-black/60"
        onClick={() => setIsOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[85dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-[14px] border border-line bg-panel-2 shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} width="15" height="15">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <TemplatePickerContent onClose={() => setIsOpen(false)} onTemplateSelected={onTemplateSelected} />
      </div>
    </div>
  );
}
