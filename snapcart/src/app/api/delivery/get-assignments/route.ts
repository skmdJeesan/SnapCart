import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import Delivery from "@/src/models/delivery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB()
    const session = await auth()
    const assignments = await Delivery.find({
      broadcastedTo: session?.user?.id,
      status: 'broadcasted'
    }).populate('order')
    if(!assignments) return NextResponse.json( {message: 'No Assignments are there'}, {status: 200})
    return NextResponse.json( assignments, {status: 200})
  } catch (error) {
    return NextResponse.json( {message: `get assignment error ${error}`}, {status: 500})
  }
}