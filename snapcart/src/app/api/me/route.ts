import { auth } from "@/src/auth";
import connectDB from "@/src/lib/db";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // make sure the database is connected before querying
    await connectDB();

    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ email: session.user.email }).select("-password");
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // log the error to help with debugging
    console.error("/api/me error", error);
    return NextResponse.json(
      { message: "Internal Server Error", details: (error as any)?.message },
      { status: 500 }
    );
  }
}