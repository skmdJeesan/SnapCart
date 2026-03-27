import connectDB from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{orderId: string}>}) {
  try {
    await connectDB()
    const {orderId} = await params
    const order = await Order.findById(orderId).populate('assignedDeliveryBoy')
    if(!order)
      return NextResponse.json({ message: 'Order not found' }, { status: 401 })
    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}