import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsView } from "@/components/settings/settings-view";
import prisma from "@/lib/db";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <AppShell>
      <SettingsView
        user={{
          id: user.id,
          name: user.name || "",
          email: user.email,
          image: user.image,
          brandVoice: user.brandVoice || "",
          writingStyle: user.writingStyle || "",
          industry: user.industry || "",
          jobTitle: user.jobTitle || "",
          company: user.company || "",
          timezone: user.timezone || "UTC",
        }}
        hasPassword={!!user.password}
      />
    </AppShell>
  );
}
