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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users, DollarSign, Activity, FileText, Shield, TrendingUp, Trash2, Search,
  AlertTriangle, CheckCircle, Database, Server, Clock, Lock, Key, Ban,
  UserX, CreditCard, BarChart3, Settings, Edit
} from "lucide-react";
import { toast } from "sonner";

type Role = "USER" | "PRO" | "ADMIN" | "BANNED";
type Plan = "FREE" | "PRO" | "TEAM" | "ENTERPRISE";
type Status = "Active" | "Suspended" | "Banned";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  plan: Plan;
  credits: number;
  status: Status;
  usage: number;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  { id: "1", email: "sarah@example.com", name: "Sarah Chen", role: "ADMIN", plan: "ENTERPRISE", credits: 50000, status: "Active", usage: 1240, createdAt: "2024-01-15" },
  { id: "2", email: "marcus@example.com", name: "Marcus Lee", role: "USER", plan: "FREE", credits: 45, status: "Active", usage: 12, createdAt: "2024-02-10" },
  { id: "3", email: "david@example.com", name: "David Park", role: "PRO", plan: "PRO", credits: 180, status: "Active", usage: 450, createdAt: "2024-02-20" },
  { id: "4", email: "emma@example.com", name: "Emma Wilson", role: "BANNED", plan: "FREE", credits: 0, status: "Banned", usage: 5, createdAt: "2024-03-01" },
  { id: "5", email: "alex@example.com", name: "Alex Kim", role: "USER", plan: "TEAM", credits: 1200, status: "Active", usage: 890, createdAt: "2024-03-05" },
  { id: "6", email: "priya@example.com", name: "Priya Sharma", role: "USER", plan: "FREE", credits: 150, status: "Suspended", usage: 2, createdAt: "2024-03-10" },
];

const INITIAL_FLAGS = [
  { key: "maintenance_mode", label: "Maintenance Mode", description: "Display maintenance page to all non-admins", value: false },
  { key: "registration_open", label: "Registration Open", description: "Allow new users to sign up", value: true },
  { key: "credit_system", label: "Credit System Active", description: "Enforce credit limits for generation", value: true },
  { key: "ai_studio", label: "AI Studio", description: "Enable AI content generation", value: true },
  { key: "calendar", label: "Content Calendar", description: "Enable scheduling features", value: true },
  { key: "analytics", label: "Analytics Dashboard", description: "Enable analytics page", value: true },
  { key: "team_features", label: "Team Features", description: "Enable multi-member workspaces", value: false },
  { key: "linkedin_integration", label: "LinkedIn Integration", description: "Enable LinkedIn OAuth", value: false },
  { key: "api_access", label: "API Access", description: "Enable public API", value: true },
];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(MOCK_USERS);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.plan.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value: !f.value } : f))
    );
    toast.success("Feature flag updated");
  };

  const deleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    }
  };

  const banUser = (id: string) => {
    if (confirm("Are you sure you want to ban this user?")) {
      updateUser(id, { status: "Banned", role: "BANNED" });
      toast.success("User banned");
    }
  };

  const toggleSuspend = (id: string, currentStatus: Status) => {
    const newStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    updateUser(id, { status: newStatus });
    toast.success(`User ${newStatus.toLowerCase()}`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const editCredits = (id: string, current: number) => {
    const amount = prompt("Enter new credit amount:", current.toString());
    if (amount && !isNaN(Number(amount))) {
      updateUser(id, { credits: Number(amount) });
      toast.success("Credits updated");
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "Suspended": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "Banned": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Admin</h1>
          <p className="text-muted-foreground mt-1">Platform administration, analytics, and access control.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard title="Total Users" value="12,472" icon={Users} trend="+12%" color="text-blue-400" />
              <StatCard title="Active (24h)" value="1,843" icon={Activity} trend="+5%" color="text-green-400" />
              <StatCard title="Posts Gen." value="89.3k" icon={FileText} trend="+22%" color="text-purple-400" />
              <StatCard title="Credits Used" value="2.4M" icon={Database} trend="+18%" color="text-orange-400" />
              <StatCard title="Revenue" value="$45.2k" icon={DollarSign} trend="+8%" color="text-emerald-400" />
              <StatCard title="Conversion" value="3.2%" icon={TrendingUp} trend="-1%" color="text-pink-400" isNegative />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Feature Flags</CardTitle>
                  <CardDescription>System-wide capabilities and maintenance</CardDescription>
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
              
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system and user events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { msg: "New Enterprise signup: Acme Corp", time: "2 mins ago", icon: Users },
                      { msg: "DeepSeek-V4-Pro rate limit warning", time: "15 mins ago", icon: AlertTriangle, color: "text-yellow-500" },
                      { msg: "System backup completed", time: "1 hour ago", icon: Database },
                      { msg: "Admin 'Sarah Chen' changed feature flag", time: "2 hours ago", icon: Settings },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`p-2 rounded-full bg-muted ${act.color || "text-foreground"}`}>
                          <act.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">{act.msg}</div>
                        <div className="text-muted-foreground text-xs">{act.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Showing {filteredUsers.length} of {users.length} users</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline">Export CSV</Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] rounded-md border border-border">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role & Plan</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                  {user.name?.charAt(0) || user.email.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium">{user.name || "Unknown"}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.status)} variant="outline">
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Select
                                  value={user.role}
                                  onValueChange={(val: Role) => updateUser(user.id, { role: val })}
                                >
                                  <SelectTrigger className="h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="PRO">Pro</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="BANNED">Banned</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Badge variant="secondary" className="w-fit text-[10px]">{user.plan}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{user.credits.toLocaleString()}</span>
                                <button onClick={() => editCredits(user.id, user.credits)} className="text-muted-foreground hover:text-foreground">
                                  <Edit className="w-3 h-3" />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{user.usage.toLocaleString()} posts</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title={user.status === "Suspended" ? "Unsuspend" : "Suspend"}
                                  onClick={() => toggleSuspend(user.id, user.status)}
                                >
                                  {user.status === "Suspended" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <UserX className="w-4 h-4 text-yellow-500" />}
                                </Button>
                                <Button variant="ghost" size="icon" title="Ban User" onClick={() => banUser(user.id)}>
                                  <Ban className="w-4 h-4 text-red-400" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Delete User" onClick={() => deleteUser(user.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CREDITS TAB */}
          <TabsContent value="credits" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Bulk Credit Operations</CardTitle>
                  <CardDescription>Grant or revoke credits across all users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Grant Amount</label>
                      <Input type="number" placeholder="e.g. 50" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Target Plan</label>
                      <Select defaultValue="ALL">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Users</SelectItem>
                          <SelectItem value="FREE">Free Only</SelectItem>
                          <SelectItem value="PRO">Pro Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => toast.success("Credits distributed successfully")}>Grant</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Plan Limits Config</CardTitle>
                  <CardDescription>Monthly default allocations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { plan: "Free", limit: "50" },
                    { plan: "Pro", limit: "1000" },
                    { plan: "Team", limit: "5000" },
                  ].map(p => (
                    <div key={p.plan} className="flex items-center justify-between">
                      <span className="font-medium">{p.plan} Plan</span>
                      <div className="flex items-center gap-2">
                        <Input defaultValue={p.limit} className="w-24 h-8 text-right" />
                        <span className="text-sm text-muted-foreground">/ mo</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => toast.success("Limits saved")}>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>IP whitelist and rate limiting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin IP Whitelist (CIDR)</label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background text-sm"
                      defaultValue="192.168.1.0/24\n10.0.0.0/8"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <div className="font-medium">Strict Rate Limiting</div>
                      <div className="text-sm text-muted-foreground">Limit 60 req/min for free users</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button onClick={() => toast.success("Security settings updated")}>Save Configuration</Button>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Recent suspicious activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Multiple failed logins", desc: "User admin@example.com - 5 attempts", time: "10m ago", level: "high" },
                      { title: "Unusual API traffic", desc: "Spike from IP 192.168.4.5", time: "1h ago", level: "med" },
                      { title: "New admin role granted", desc: "Granted to sarah@example.com by system", time: "2d ago", level: "low" },
                    ].map((alert, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30">
                        <Shield className={`w-5 h-5 shrink-0 ${
                          alert.level === 'high' ? 'text-red-500' : alert.level === 'med' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-muted-foreground">{alert.desc}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SYSTEM TAB */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Live metrics of critical services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <HealthMetric title="API Gateway" status="Operational" latency="45ms" icon={Server} />
                  <HealthMetric title="Primary Database" status="Operational" latency="12ms" icon={Database} />
                  <HealthMetric title="AI Provider (DeepSeek)" status="Degraded" latency="850ms" icon={BarChart3} warning />
                  <HealthMetric title="Uptime (30d)" status="99.98%" latency="Target: 99.9%" icon={Clock} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AppShell>
  );
}

function StatCard({ title, value, icon: Icon, trend, color, isNegative }: { title: string, value: string, icon: any, trend: string, color: string, isNegative?: boolean }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`w-4 h-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {trend} from last month
        </p>
      </CardContent>
    </Card>
  );
}

function HealthMetric({ title, status, latency, icon: Icon, warning }: { title: string, status: string, latency: string, icon: any, warning?: boolean }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-muted/20 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${warning ? 'bg-yellow-500' : 'bg-green-500'}`} />
      </div>
      <div>
        <div className={`text-lg font-bold ${warning ? 'text-yellow-500' : 'text-green-500'}`}>{status}</div>
        <div className="text-xs text-muted-foreground">{latency}</div>
      </div>
    </div>
  );
}
