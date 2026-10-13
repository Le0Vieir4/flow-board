import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account — FlowBoard",
  description:
    "Create boards, invite your team and watch work move from idea to done — set up your first board in under a minute.",
};



export default async function RegisterPage() {

  return (
    <div>
      <AuthShell
        headline={
          <>
            Set up your first board in{" "}
            <span className="bg-linear-to-r from-[#7f97ff] to-primary bg-clip-text text-transparent">
              under a minute.
            </span>
          </>
        }
        paragraph="Create boards, invite your team and watch work move from idea to done — all in one place, updated in real time."
        boardName="Product Launch v2"
        columns={[
          {
            name: "Backlog",
            count: "3",
            cards: [
              { title: "Refactor Auth Flow", tag: { label: "Electric Blue", color: "bg-tag-electric" } },
              { title: "Finalize UI Kit", tag: { label: "Medium", color: "bg-tag-medium" } },
            ],
          },
          {
            name: "Todo",
            count: "2",
            cards: [
              { title: "Dashboard Redesign", tag: { label: "Design", color: "bg-tag-design" } },
              { title: "Implement Notifications", tag: { label: "Low", color: "bg-tag-low" } },
            ],
          },
        ]}
        toast={{
          text: (
            <>
              Board <span className="text-link font-semibold">Product Launch v2</span> created
            </>
          ),
          time: "Just now",
        }}
        trustText="Free for teams up to 10 · No credit card required"
      >
        <RegisterForm redirect="/dashboard" />
      </AuthShell>
    </div>
  );
}
