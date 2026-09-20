import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { sessionId, planName } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("id", session.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, message: "Already recorded" });
    }

    const amountPaid = session.amount_total / 100;
    const customerEmail = session.customer_details?.email;

    
    await supabase.from("payments").insert([
      {
        id: session.id,
        plan_name: planName || "Premium Plan",
        amount: amountPaid,
        currency: session.currency || "inr",
        customer_email: customerEmail,
        status: "completed",
      },
    ]);

   
    await supabase.from("admin_notifications").insert([
      {
        title: "New Premium Subscription! 🎉",
        message: `${customerEmail || 'A user'} purchased ${planName || "Premium"} for ₹${amountPaid}`,
        amount: amountPaid,
        is_read: false,
      },
    ]);

    
    if (customerEmail) {
      await supabase
        .from("profiles")
        .update({ 
          is_premium: true, 
          plan_name: planName || "Premium",
          premium_since: new Date().toISOString()
        })
        .eq("email", customerEmail);
    }

    return NextResponse.json({ success: true, amount: amountPaid });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}