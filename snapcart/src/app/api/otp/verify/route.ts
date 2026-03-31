import connectDB from "@/src/lib/db";
import emitEventHandler from "@/src/lib/emitEventHandler";
import Delivery from "@/src/models/delivery.model";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const {orderId, otp} = await req.json()
    if(!orderId || !otp) {
      return NextResponse.json(
        {message: 'orderId or otp not found'},
        {status: 400}
      )
    }
    const order = await Order.findById(orderId)
    if(!order) {
      return NextResponse.json(
        {message: 'order not found'},
        {status: 400}
      )
    }

    if(order.deliveryOtp !== otp) {
      return NextResponse.json(
        {message: 'Incorrect or expired otp!'},
        {status: 400}
      )
    }

    order.status = 'delivered'
    order.deliveryOtpVerification = true
    order.deliveredAt = new Date()
    await order.save()
    await emitEventHandler('order-status-update', {orderId: order._id, status: order.status})

    await Delivery.updateOne(
      {order: orderId},
      {$set: {assignedTo: null, status: 'completed'}}
    )

    return NextResponse.json(
      {message: 'successfully Item is delivered🎉'},
      {status: 200}
    )

  } catch (error) {
    return NextResponse.json(
      {message: `otp verify error ${error}`},
      {status: 500}
      )
  }
}