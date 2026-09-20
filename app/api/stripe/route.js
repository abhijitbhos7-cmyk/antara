import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe Secret Key is missing" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { planName, price, interval } = await req.json();

    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `http://${baseUrl}`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Antara ${planName}`,
              description: `Subscription interval: ${interval}`,
            },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      success_url: `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(planName)}`,
      cancel_url: `${baseUrl}/premium/checkout?plan=${encodeURIComponent(planName)}&price=${price}&interval=${encodeURIComponent(interval)}`,
    });

    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}