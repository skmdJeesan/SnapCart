import connectDB from "@/src/lib/db";
import emitEventHandler from "@/src/lib/emitEventHandler";
import Delivery from "@/src/models/delivery.model";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, {params}: {params: Promise<{orderId: string}>}) {
  try {
    await connectDB()

    // params is a Promise in Next.js 13+, so await it
    const { orderId } = await params
    if (!orderId)
      return NextResponse.json({ message: 'Missing orderId in params' }, { status: 400 })

    // optional: validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: 'Invalid orderId' }, { status: 400 })
    }

    const { status } = await req.json()

    const allowedStatuses = ['pending', 'out for delivery']
    if (!allowedStatuses.includes(status))
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 })

    const order = await Order.findById(orderId).populate('userId')
    if (!order) return NextResponse.json({ message: 'Order not found!' }, { status: 404 })
    order.status = status

    let deliveryBoysPayload:any = []
    // match the enum defined in order.model.ts
    if (status === 'out for delivery' && !order.assignment) {
      const {latitude, longitude} = order.address
      if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return NextResponse.json({ message: 'Invalid address coordinates' }, { status: 400 })
      }
      const nearby_deliveryBoys = await User.find({
        role: 'deliveryBoy',
        location: {
          $near: {
            $geometry: {type: 'Point', coordinates: [Number(longitude), Number(latitude)]},
            $maxDistance: 10000
          }
        }
      })

      const nearby_ids = nearby_deliveryBoys.map((boys) => boys._id)
      const busy_ids = await Delivery.find({
        assignedTo: {$in: nearby_ids},
        status: 'assigned'
      }).distinct('broadcastedTo')

      const busy_ids_set = new Set(busy_ids.map(b => String(b)))
      const available_deliveryBoys = nearby_deliveryBoys.filter( b => !busy_ids_set.has(String(b._id)))

      const candidates = available_deliveryBoys.map(b => b._id)
      if(candidates.length == 0) {
        await order.save()
        await emitEventHandler('order-status-update', {orderId: order._id, status: order.status})
        return NextResponse.json({message: 'No near by delivery boys are found!'}, {status: 200})
      }

      const deliveryAssignment = await Delivery.create({
        order: order._id,
        broadcastedTo: candidates,
        status: 'broadcasted'
      })

      await deliveryAssignment.populate({ path: 'order', populate: { path: 'items' } })

      for(const boy of available_deliveryBoys) {
        if(boy.socketId) await emitEventHandler('new-assignment', deliveryAssignment, boy.socketId)
      }

      order.assignment = deliveryAssignment._id

      deliveryBoysPayload = available_deliveryBoys.map(b => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        longitude: b.location.coordinates[0],
        latitude: b.location.coordinates[1]
      }))

      // console.log('Available delivery boys:', deliveryBoysPayload)
    }

    await order.save()
    // populate the actual field name, not a non-existent "user"
    await order.populate('userId')
    await emitEventHandler('order-status-update', {orderId: order._id, status: order.status})
    return NextResponse.json({
      assignment: order.assignment?._id,
      availableBoys: deliveryBoysPayload
    }, {status: 200})

  } catch (error) {
    // log the error for debugging purposes
    console.error('update-order-status POST error', error)
    return NextResponse.json({
      message: `Update status error: ${(error as any).message || error}`,
    }, { status: 500 })
  }
}