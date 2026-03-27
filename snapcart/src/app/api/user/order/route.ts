import connectDB from "@/src/lib/db";
import emitEventHandler from "@/src/lib/emitEventHandler";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { userId, items, totalAmount, paymentMethod, address } = await request.json()
    
    // Debug logging
    // console.log("Order request received:", { userId, items, totalAmount, paymentMethod, address })
    
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
    await emitEventHandler('new-order', newOrder)
    return NextResponse.json({ message: "Order placed successfully", order: newOrder }, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ message: "Place Order Internal Server Error", error: String(error) }, { status: 500 })
  }
}