import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Terms of Service — FlowBoard",
  description: "FlowBoard's Terms of Service, coming soon.",
};

export default function TermsPage() {
  return (
    <ComingSoonPage
      title="Terms of Service"
      description="We're drafting these. FlowBoard's terms will be published here before launch — so you'll always know exactly what you're agreeing to."
    />
  );
}
