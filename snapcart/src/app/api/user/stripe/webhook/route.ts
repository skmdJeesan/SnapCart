import connectDB from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature")
  const rawBody = await req.text()
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.log('payment failed!', error)
  }

  if(event?.type == 'checkout.session.completed') {
    const session = event.data.object
    await connectDB()
    await Order.findByIdAndUpdate(session?.metadata?.orderId, { isPaid: true})
  }

  return NextResponse.json({recieved: true}, {status: 200})
}