"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  Smartphone,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatRelativeTime } from "@/lib/utils";

interface UserSettings {
  id: string;
  name: string;
  email: string;
  image: string | null;
  brandVoice: string;
  writingStyle: string;
  industry: string;
  jobTitle: string;
  company: string;
  timezone: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: Date | string | null;
  expiresAt: Date | string | null;
  permissions: string[];
  createdAt: Date | string;
}

interface SettingsViewProps {
  user: UserSettings;
  hasPassword: boolean;
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const writingStyles = [
  "Professional",
  "Casual",
  "Conversational",
  "Academic",
  "Persuasive",
  "Storytelling",
  "Humorous",
  "Direct",
  "Empathetic",
  "Authoritative",
];

const industries = [
  "Technology",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "E-commerce",
  "Real Estate",
  "Consulting",
  "Media",
  "Non-profit",
  "Government",
  "Manufacturing",
  "Other",
];

export function SettingsView({ user, hasPassword }: SettingsViewProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserSettings>(user);
  const [workspace, setWorkspace] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    postPublished: true,
    weeklyDigest: true,
    productUpdates: false,
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  useEffect(() => {
    fetch("/api/settings/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data) setNotifications(data);
      })
      .catch(() => {});
    fetch("/api/settings/workspace")
      .then((r) => r.json())
      .then((data) => {
        if (data) setWorkspace(data);
      })
      .catch(() => {});
    fetch("/api/settings/api-keys")
      .then((r) => r.json())
      .then((keys) => setApiKeys(keys || []))
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    setLoading("profile");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        toast.success("Profile saved", {
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast.error("Failed to save profile.");
      }
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setLoading(null);
    }
  };

  const saveWorkspace = async () => {
    setLoading("workspace");
    try {
      const res = await fetch("/api/settings/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspace),
      });
      if (res.ok) {
        toast.success("Workspace saved", {
          description: "Your workspace settings have been updated.",
        });
      } else {
        toast.error("Failed to save workspace.");
      }
    } catch {
      toast.error("Failed to save workspace.");
    } finally {
      setLoading(null);
    }
  };

  const saveNotifications = async () => {
    setLoading("notifications");
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });
      if (res.ok) {
        toast.success("Notifications saved", {
          description: "Your notification preferences have been updated.",
        });
      } else {
        toast.error("Failed to save notifications.");
      }
    } catch {
      toast.error("Failed to save notifications.");
    } finally {
      setLoading(null);
    }
  };

  const changePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (security.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading("security");
    try {
      const res = await fetch("/api/settings/security/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed", {
          description: "Your password has been updated.",
        });
        setSecurity((s) => ({
          ...s,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(data.error || "Failed to change password.");
      }
    } catch {
      toast.error("Failed to change password.");
    } finally {
      setLoading(null);
    }
  };

  const toggleTwoFactor = async () => {
    setLoading("security");
    try {
      const res = await fetch("/api/settings/security/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !security.twoFactorEnabled }),
      });
      if (res.ok) {
        const next = !security.twoFactorEnabled;
        setSecurity((s) => ({ ...s, twoFactorEnabled: next }));
        toast.success(next ? "2FA enabled" : "2FA disabled", {
          description: next
            ? "Two-factor authentication has been enabled."
            : "Two-factor authentication has been disabled.",
        });
      } else {
        toast.error("Failed to update 2FA.");
      }
    } catch {
      toast.error("Failed to update 2FA.");
    } finally {
      setLoading(null);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your API key.");
      return;
    }
    setCreatingKey(true);
    try {
      const res = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedKey(data.key);
        setApiKeys((prev) => [
          ...prev,
          { ...data.apiKey, createdAt: new Date() },
        ]);
        setNewKeyName("");
        toast.success("API key created", {
          description: "Your API key has been generated.",
        });
      } else {
        toast.error(data.error || "Failed to create API key.");
      }
    } catch {
      toast.error("Failed to create API key.");
    } finally {
      setCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const res = await fetch(`/api/settings/api-keys/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
        toast.success("API key deleted", {
          description: "The API key has been revoked.",
        });
      } else {
        toast.error("Failed to delete API key.");
      }
    } catch {
      toast.error("Failed to delete API key.");
    }
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast.success("Copied", { description: "API key copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and content preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={profile.image || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, image: e.target.value })
                    }
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(v) =>
                      setProfile({ ...profile, timezone: v })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, jobTitle: e.target.value })
                    }
                    placeholder="e.g. Marketing Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={profile.industry}
                    onValueChange={(v) =>
                      setProfile({ ...profile, industry: v })
                    }
                  >
                    <SelectTrigger id="industry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="writingStyle">Writing Style</Label>
                  <Select
                    value={profile.writingStyle}
                    onValueChange={(v) =>
                      setProfile({ ...profile, writingStyle: v })
                    }
                  >
                    <SelectTrigger id="writingStyle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {writingStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandVoice">Brand Voice</Label>
                <Textarea
                  id="brandVoice"
                  value={profile.brandVoice}
                  onChange={(e) =>
                    setProfile({ ...profile, brandVoice: e.target.value })
                  }
                  placeholder="Describe your brand voice and tone..."
                  rows={4}
                />
              </div>
              <Button onClick={saveProfile} disabled={loading === "profile"}>
                {loading === "profile" && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace */}
        <TabsContent value="workspace" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Manage your workspace identity and description.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ws-name">Workspace Name</Label>
                  <Input
                    id="ws-name"
                    value={workspace.name}
                    onChange={(e) =>
                      setWorkspace({ ...workspace, name: e.target.value })
                    }
                    placeholder="My Workspace"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ws-slug">Workspace Slug</Label>
                  <Input
                    id="ws-slug"
                    value={workspace.slug}
                    onChange={(e) =>
                      setWorkspace({
                        ...workspace,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s/g, "-"),
                      })
                    }
                    placeholder="my-workspace"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws-desc">Description</Label>
                <Textarea
                  id="ws-desc"
                  value={workspace.description}
                  onChange={(e) =>
                    setWorkspace({
                      ...workspace,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your workspace..."
                  rows={3}
                />
              </div>
              <Button onClick={saveWorkspace} disabled={loading === "workspace"}>
                {loading === "workspace" && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what emails you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your account.
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(v) =>
                    setNotifications({
                      ...notifications,
                      emailNotifications: v,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="post-pub">Post Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your posts are published.
                  </p>
                </div>
                <Switch
                  id="post-pub"
                  checked={notifications.postPublished}
                  onCheckedChange={(v) =>
                    setNotifications({
                      ...notifications,
                      postPublished: v,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your content performance.
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(v) =>
                    setNotifications({
                      ...notifications,
                      weeklyDigest: v,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="product-updates">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new features and product updates.
                  </p>
                </div>
                <Switch
                  id="product-updates"
                  checked={notifications.productUpdates}
                  onCheckedChange={(v) =>
                    setNotifications({
                      ...notifications,
                      productUpdates: v,
                    })
                  }
                />
              </div>
              <Button
                onClick={saveNotifications}
                disabled={loading === "notifications"}
                className="mt-2"
              >
                {loading === "notifications" && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    Current Plan
                  </div>
                  <div className="text-xl font-bold mt-1">Free</div>
                  <Badge className="mt-2">10 credits/month</Badge>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    Next Billing
                  </div>
                  <div className="text-xl font-bold mt-1">--</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    No active subscription
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="gradient">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-pw">Current Password</Label>
                  <Input
                    id="current-pw"
                    type={showPasswords ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <Input
                    id="new-pw"
                    type={showPasswords ? "text" : "password"}
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type={showPasswords ? "text" : "password"}
                    value={security.confirmPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {showPasswords ? "Hide" : "Show"} Passwords
                </Button>
                <Button
                  onClick={changePassword}
                  disabled={loading === "security"}
                >
                  {loading === "security" && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">2FA Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      {security.twoFactorEnabled
                        ? "Two-factor authentication is enabled."
                        : "Protect your account with 2FA."}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={toggleTwoFactor}
                  disabled={loading === "security"}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="key-name">New Key Name</Label>
                  <Input
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production Key"
                  />
                </div>
                <Button onClick={createApiKey} disabled={creatingKey}>
                  {creatingKey ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Key
                </Button>
              </div>

              {generatedKey && (
                <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-green-500 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        New API Key Generated
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Copy this key now. You will not be able to see it again.
                      </p>
                      <code className="block mt-2 p-2 bg-muted rounded text-xs font-mono break-all">
                        {generatedKey}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyKey(generatedKey)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setGeneratedKey(null)}
                  >
                    I have copied it
                  </Button>
                </div>
              )}

              <div className="space-y-2 mt-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No API keys yet. Create one to get started.</p>
                  </div>
                ) : (
                  apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                          <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{key.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Created {formatRelativeTime(key.createdAt)}
                            {key.lastUsed
                              ? ` · Last used ${formatRelativeTime(key.lastUsed)}`
                              : " · Never used"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {key.permissions.join(", ") || "read"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyKey(key.key)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
