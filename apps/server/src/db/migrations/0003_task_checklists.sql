--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_checklists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" integer NOT NULL,
	"done" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_checklists_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_checklists_task_id_idx" ON "task_checklists" USING btree ("task_id");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" DROP COLUMN IF EXISTS "checklist_done";
EXCEPTION
 WHEN OTHERS THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" DROP COLUMN IF EXISTS "checklist_total";
EXCEPTION
 WHEN OTHERS THEN null;
END $$;
