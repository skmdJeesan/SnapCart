import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import Delivery from "@/src/models/delivery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  try {
    await connectDB()
    const { id } = await params
    const session = await auth()
    const deliveryBoyId = session?.user?.id
    if (!deliveryBoyId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const assignment = await Delivery.findOne({ _id: id, broadcastedTo: deliveryBoyId })
    if (!assignment) return NextResponse.json({ message: 'Assignment not found' }, { status: 404 })

    if(assignment.status !== 'broadcasted') {
      return NextResponse.json({ message: `Cannot reject assignment with status ${assignment.status}` }, { status: 400 })
    }

    // Remove the delivery boy from broadcastedTo
    await Delivery.updateOne(
      { _id: id },
      { $pull: { broadcastedTo: deliveryBoyId } }
    )

    return NextResponse.json({ message: 'Assignment rejected' }, { status: 200 })
  } catch (error) {
    console.error('reject-assignment error', error)
    return NextResponse.json({
      message: `Reject assignment error: ${(error as any).message || error}`,
    }, { status: 500 })
  }
}