import connectDB from "@/src/lib/db";
import Grocery from "@/src/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const groceries = await Grocery.find({})
    return NextResponse.json(groceries, {status: 200})
  } catch (error) {
    return NextResponse.json({
      message: `grocey finding error ${error}`},
      {status: 500
    })
  }
}