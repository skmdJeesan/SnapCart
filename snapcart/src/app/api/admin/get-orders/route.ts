import connectDB from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    // schema has userId field, not "user"; populate the correct path
    const orders = await Order.find({}).populate('userId assignedDeliveryBoy').sort({createdAt: -1})
    return NextResponse.json(orders, {status: 200})
  } catch (error) {
    console.error("/api/admin/get-orders error", error)
    return NextResponse.json(
      {message: `get orders error ${(error as any).message}`},
      {status: 500}
    )
  }
}