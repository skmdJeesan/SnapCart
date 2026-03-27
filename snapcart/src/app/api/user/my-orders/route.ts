import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // order schema stores a field named `userId` (not `user`), so query against that
    const orders = await Order.find({ userId: session.user.id }).populate("userId assignedDeliveryBoy").sort({createdAt: -1});
    // orders will be an array (possibly empty); just return it
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("/api/user/my-orders error", error);
    return NextResponse.json({ message: "server error", error: (error as any).message }, { status: 500 });
  }
}