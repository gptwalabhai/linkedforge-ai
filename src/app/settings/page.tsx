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

  const user = session.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          accounts: true,
        },
      }).catch(() => null)
    : null;

  const displayUser = {
    id: user?.id || session.user.id,
    name: user?.name || session.user.name || "",
    email: user?.email || session.user.email,
    image: user?.image || session.user.image || null,
    brandVoice: user?.brandVoice || "",
    writingStyle: user?.writingStyle || "",
    industry: user?.industry || "",
    jobTitle: user?.jobTitle || "",
    company: user?.company || "",
    timezone: user?.timezone || "UTC",
  };

  return (
    <AppShell>
      <SettingsView
        user={displayUser}
        hasPassword={!!user?.password}
      />
    </AppShell>
  );
}
