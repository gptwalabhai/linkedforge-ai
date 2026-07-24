"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Users, DollarSign, Activity, FileText, Shield, TrendingUp, Trash2, Search,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  credits: number;
}

interface Stats {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalPosts: number;
}

const statCards = [
  { title: "Total Users", value: 0, icon: Users, color: "text-blue-400" },
  { title: "Total Revenue", value: 0, icon: DollarSign, color: "text-green-400" },
  { title: "Active Subs", value: 0, icon: Activity, color: "text-yellow-400" },
  { title: "Total Posts", value: 0, icon: FileText, color: "text-purple-400" },
];

const featureFlags = [
  { key: "ai_studio", label: "AI Studio", description: "Enable AI content generation", value: true },
  { key: "calendar", label: "Content Calendar", description: "Enable scheduling features", value: true },
  { key: "analytics", label: "Analytics Dashboard", description: "Enable analytics page", value: true },
  { key: "team_features", label: "Team Features", description: "Enable multi-member workspaces", value: false },
  { key: "linkedin_integration", label: "LinkedIn Integration", description: "Enable LinkedIn OAuth", value: false },
  { key: "api_access", label: "API Access", description: "Enable public API", value: true },
];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalRevenue: 0, activeSubscriptions: 0, totalPosts: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [flags, setFlags] = useState(featureFlags);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setStats({ totalUsers: 1247, totalRevenue: 34520, activeSubscriptions: 423, totalPosts: 8934 });
    setUsers(MOCK_USERS);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value: !f.value } : f))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  const changeRole = (id: string, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
    toast.success("Role updated");
  };

  const updatedCards = statCards.map((c, i) => {
    const values = [stats.totalUsers, `$${stats.totalRevenue.toLocaleString()}`, stats.activeSubscriptions, stats.totalPosts];
    return { ...c, value: values[i] };
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, subscriptions, and feature flags.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {updatedCards.map((card) => (
            <Card key={card.title} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "-" : card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and permissions.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                          className="bg-transparent border border-border rounded-md px-2 py-1 text-sm"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </TableCell>
                      <TableCell>{user.credits}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Toggle platform features on and off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {flag.label}
                    {flag.value && <Badge variant="default" className="text-xs">Active</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">{flag.description}</div>
                </div>
                <Switch checked={flag.value} onCheckedChange={() => toggleFlag(flag.key)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

const MOCK_USERS: User[] = [
  { id: "1", email: "sarah@example.com", name: "Sarah Chen", role: "ADMIN", createdAt: "2024-01-15", credits: 200 },
  { id: "2", email: "marcus@example.com", name: "Marcus Lee", role: "USER", createdAt: "2024-02-10", credits: 45 },
  { id: "3", email: "david@example.com", name: "David Park", role: "USER", createdAt: "2024-02-20", credits: 180 },
  { id: "4", email: "emma@example.com", name: "Emma Wilson", role: "USER", createdAt: "2024-03-01", credits: 12 },
  { id: "5", email: "alex@example.com", name: "Alex Kim", role: "USER", createdAt: "2024-03-05", credits: 95 },
  { id: "6", email: "priya@example.com", name: "Priya Sharma", role: "USER", createdAt: "2024-03-10", credits: 150 },
  { id: "7", email: "james@example.com", name: "James Brown", role: "USER", createdAt: "2024-03-15", credits: 67 },
  { id: "8", email: "lisa@example.com", name: "Lisa Zhang", role: "USER", createdAt: "2024-03-20", credits: 200 },
];
