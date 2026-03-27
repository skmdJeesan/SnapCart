import connectDB from "@/src/lib/db";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { userId, items, totalAmount, paymentMethod, address } = await req.json()
    
    if (!userId || !items || !totalAmount || !paymentMethod || !address) {
      const missing = []
      if (!userId) missing.push('userId')
      if (!items) missing.push('items')
      if (!totalAmount) missing.push('totalAmount')
      if (!paymentMethod) missing.push('paymentMethod')
      if (!address) missing.push('address')
      console.log("Missing fields:", missing)
      return NextResponse.json({ message: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 400 })

    const newOrder = await Order.create({ userId, items, totalAmount, paymentMethod, address })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: 'payment',
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: [{
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'SnapCart Order Payment',
            },
            unit_amount: totalAmount*100,
          },
          quantity: 1,
        },
      ],
      metadata: {orderId: newOrder._id.toString()},
    })
    return NextResponse.json({url: session.url}, {status: 200})
  } catch (error) {
    return NextResponse.json({message: `order payment error ${error}`}, {status: 500})
  }
}