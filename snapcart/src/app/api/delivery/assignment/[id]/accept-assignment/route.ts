import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import emitEventHandler from "@/src/lib/emitEventHandler";
import Delivery from "@/src/models/delivery.model";
import Order from "@/src/models/order.model";
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
      return NextResponse.json({ message: `Cannot accept assignment with status ${assignment.status}` }, { status: 400 })
    }

    const alreadyAssigned = await Delivery.findOne({ broadcastedTo: deliveryBoyId, status: 'assigned' })
    if (alreadyAssigned) {
      return NextResponse.json({ message: 'Already have an active delivery' }, { status: 400 })
    }

    assignment.assignedTo = deliveryBoyId
    assignment.status = 'assigned'
    assignment.acceptedAt = new Date()
    await assignment.save()

    const order = await Order.findById(assignment.order)
    if(!order) return NextResponse.json({ message: 'Associated order not found' }, { status: 404 })

    order.assignment = assignment._id
    order.assignedDeliveryBoy = deliveryBoyId
    order.status = 'out for delivery'
    await order.save()
    
    await order.populate('assignedDeliveryBoy')
    await emitEventHandler('order-assigned', {
      orderId: order._id,
      assignedDeliveryBoy: order.assignedDeliveryBoy
    })
    
    await Delivery.updateMany(
      { _id: { $ne: assignment._id }, broadcastedTo: deliveryBoyId, status: 'broadcasted' },
      { $pull: { broadcastedTo: deliveryBoyId } }
    )

    return NextResponse.json({ message: 'Assignment accepted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `Accept assignment error ${error}` }, { status: 500 })
  }
}