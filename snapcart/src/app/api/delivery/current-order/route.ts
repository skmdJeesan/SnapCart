import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import Delivery from "@/src/models/delivery.model";
import Order from "@/src/models/order.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB()
    const session = await auth()
    const deliveryBoyId = session?.user?.id

    console.log("Registered models:", Object.keys(mongoose.models))
    console.log("DeliveryBoyId:", deliveryBoyId)
    console.log("DeliveryBoyId type:", typeof deliveryBoyId) 

    const activeAssignment = await Delivery.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned"
    }).populate({
      path: 'order',
      populate: { path: 'address' }
    }).lean()

    if (!activeAssignment) {
      return NextResponse.json(
        { active: false },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { active: true, activeAssignment: activeAssignment },
      { status: 200 }
    )

  } catch (error) {
    //console.error("CURRENT ORDER ERROR:", error)
    return NextResponse.json(
      { message: "Error fetching active delivery assignment", error },
      { status: 500 }
    )
  }
}