import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — FlowBoard",
  description:
    "Boards, comments and notifications sync in real time — log back in and pick up right where your team left off.",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;
  const redirectTo = redirect ?? "/boards";

  return (
    <AuthShell
      headline={
        <>
          Pick up right where your team{" "}
          <span className="bg-gradient-to-r from-[#7f97ff] to-primary bg-clip-text text-transparent">
            left off.
          </span>
        </>
      }
      paragraph="Boards, comments and notifications sync in real time — log back in and everything is exactly where you left it."
      boardName="Product Launch v2"
      columns={[
        {
          name: "In Progress",
          count: "3",
          cards: [
            { title: "API Rate Limiting", tag: { label: "High", color: "bg-tag-electric" } },
            { title: "Add Activity Timeline", tag: { label: "Medium", color: "bg-tag-medium" } },
          ],
        },
        {
          name: "Review",
          count: "2",
          cards: [
            { title: "Mobile Responsiveness", tag: { label: "Design", color: "bg-tag-design" } },
            { title: "Performance Optimization", tag: { label: "Low", color: "bg-tag-low" } },
          ],
        },
      ]}
      toast={{
        text: (
          <>
            Task moved to <span className="text-link font-semibold">Review</span>
          </>
        ),
        time: "Just now",
      }}
      trustText="Free for teams up to 10 · No credit card required"
    >
      <LoginForm redirect={redirectTo} />
    </AuthShell>
  );
}
