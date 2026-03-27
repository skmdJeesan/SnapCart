import connectDB from "@/src/lib/db";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const admin = await User.find({role: 'admin'})
    if(admin.length > 0) 
      return NextResponse.json({adminExists: true}, {status: 200})
    else
      return NextResponse.json({adminExists: false}, {status: 200})
  } catch (error) {
    return NextResponse.json({message: `Admin search error: ${error}`}, {status: 500})
  }
}