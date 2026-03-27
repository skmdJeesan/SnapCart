import connectDB from "@/src/lib/db";
import { sendMail } from "@/src/lib/mailer";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const {orderId} = await req.json()
    const order = await Order.findById(orderId).populate('userId')
    if(!order) {
      return NextResponse.json(
        {message: 'order not found'},
        {status: 400}
      )
    }

    const otp = Math.floor(1000 + Math.random()*9000).toString()
    order.deliveryOtp = otp
    await order.save()

    await sendMail(
      order.userId.email,
      "Your Delivery OTP",
      `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`
    )

    return NextResponse.json(
      {message: 'otp dent successfully'},
      {status: 200}
    )

  } catch (error) {
    return NextResponse.json(
      {message: `send otp error ${error}`},
      {status: 500}
      )
  }
}