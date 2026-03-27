import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import Grocery from "@/src/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if(session?.user?.role !== 'admin') {
      return NextResponse.json(
        {message: 'You are not admin'},
        {status: 403}
      )
    }

    const {groceryId} = await req.json()
    const grocery = await Grocery.findByIdAndDelete(groceryId)

    return NextResponse.json( 
      grocery,
      {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
      {message: `Error in delete grocery : ${error}`},
      {status: 500}
    )
  }
}