"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Send, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  { q: "How do AI credits work?", a: "Each AI generation consumes 1 credit. Different content types may consume different amounts. Credits reset monthly based on your subscription plan." },
  { q: "Can I connect my LinkedIn account?", a: "Yes! Go to Settings → Integrations to connect your LinkedIn account via OAuth. You can then publish posts directly and track engagement." },
  { q: "What happens when I run out of credits?", a: "You can purchase additional credits or upgrade to a higher plan. Unused credits roll over for Pro and Team plans." },
  { q: "How does the brand voice training work?", a: "Provide writing samples, your website content, or describe your tone. The AI learns your unique voice and applies it consistently." },
  { q: "Can I collaborate with my team?", a: "Team plans include multi-member workspaces, role-based permissions, approval workflows, and shared templates." },
  { q: "Is my data secure?", a: "We use industry-standard encryption, never store your LinkedIn password, and are SOC 2 compliant. Your content is yours alone." },
];

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "1", subject: "Integration not working", status: "OPEN", priority: "HIGH", createdAt: "2024-01-10" },
    { id: "2", subject: "Billing question", status: "CLOSED", priority: "MEDIUM", createdAt: "2024-01-05" },
  ]);

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, priority, message }),
      });
      toast.success("Support ticket created!");
      setTickets((prev) => [
        { id: String(Date.now()), subject, status: "OPEN", priority, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setSubject("");
      setMessage("");
      setPriority("MEDIUM");
    } catch {
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CLOSED: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const priorityColors: Record<string, string> = {
    LOW: "text-muted-foreground",
    MEDIUM: "text-yellow-400",
    HIGH: "text-orange-400",
    URGENT: "text-red-400",
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Support Center</h1>
          <p className="text-sm text-muted-foreground mt-1">We&apos;re here to help. Find answers or contact us.</p>
        </div>

        {/* FAQ */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Submit Ticket */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Submit a Ticket
              </CardTitle>
              <CardDescription>Describe your issue and we&apos;ll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitTicket} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="mt-2"
                  />
                </div>
                <Button type="submit" variant="gradient" loading={submitting} className="w-full">
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Tickets */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                My Tickets
              </CardTitle>
              <CardDescription>Track your support requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 rounded-md border border-border bg-card hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{ticket.subject}</div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                            <span className={priorityColors[ticket.priority] || ""}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <Badge className={`text-xs ${statusColors[ticket.status] || ""}`}>
                          {ticket.status === "CLOSED" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
