import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Privacy Policy — FlowBoard",
  description: "FlowBoard's Privacy Policy, coming soon.",
};

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      title="Privacy Policy"
      description="We're drafting this. FlowBoard's privacy policy will be published here before launch — so you'll always know exactly how your data is handled."
    />
  );
}
