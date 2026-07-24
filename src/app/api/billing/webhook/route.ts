import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build", {
  apiVersion: "2025-02-24.acacia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = checkoutSession.subscription as string | null;
        const customerId = checkoutSession.customer as string;
        const userId = checkoutSession.metadata?.userId;

        if (subscriptionId) {
          const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;
          const planMap: Record<string, "FREE" | "PRO" | "TEAM" | "ENTERPRISE"> = {
            [process.env.STRIPE_PRO_PRICE_ID || ""]: "PRO",
            [process.env.STRIPE_TEAM_PRICE_ID || ""]: "TEAM",
            [process.env.STRIPE_ENTERPRISE_PRICE_ID || ""]: "ENTERPRISE",
          };
          const detectedPlan = planMap[subscription.items.data[0].price.id] || "PRO";

          await prisma.subscription.upsert({
            where: { userId: userId || "" },
            update: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              plan: detectedPlan,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              creditsMonthly: getPlanCredits(detectedPlan),
              creditsUsed: 0,
            },
            create: {
              userId: userId || "",
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              plan: detectedPlan,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              creditsMonthly: getPlanCredits(detectedPlan),
              creditsUsed: 0,
            },
          });

          await prisma.user.update({
            where: { id: userId || "" },
            data: { credits: getPlanCredits(detectedPlan) },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const planMap: Record<string, "FREE" | "PRO" | "TEAM" | "ENTERPRISE"> = {
          [process.env.STRIPE_PRO_PRICE_ID || ""]: "PRO",
          [process.env.STRIPE_TEAM_PRICE_ID || ""]: "TEAM",
          [process.env.STRIPE_ENTERPRISE_PRICE_ID || ""]: "ENTERPRISE",
        };
        const priceId = subscription.items.data[0].price.id;
        const detectedPlan = planMap[priceId] || "PRO";

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            plan: detectedPlan,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            creditsMonthly: getPlanCredits(detectedPlan),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "canceled",
            plan: "FREE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: false,
            creditsMonthly: 10,
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await prisma.invoice.create({
          data: {
            stripeInvoiceId: invoice.id,
            subscriptionId: "",
            userId: "",
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "paid",
            pdfUrl: invoice.hosted_invoice_url || null,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function getPlanCredits(plan: string): number {
  switch (plan) {
    case "PRO": return 200;
    case "TEAM": return 1000;
    case "ENTERPRISE": return 5000;
    default: return 10;
  }
}
