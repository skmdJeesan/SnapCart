import connectDB from "@/src/lib/db";
import User from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. connect db and fetch data from frontend(client side request)
    await connectDB()
    const {name, email, password} = await req.json()

    // 2. check if user already registered with this email before or not
    const userExist = await User.findOne({email})
    if(userExist) {
      return NextResponse.json({
        message: `Bhai, user already exist!`
      }, {status: 400})
    }

    // 3. check password is valid or not
    if(password.length < 6) {
      return NextResponse.json({
        message: `Oh Bhai, Password must be consists atleast 6 characters!`
      }, {status: 400})
    }

    // 4. password hashing before create a new user
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. create a new user
    const user = await User.create({name, email, password: hashedPassword})
    return NextResponse.json(user, {status: 200})

  } catch (error) {
    return NextResponse.json({
      message: `server error ${error}`
    }, {status: 500})
  }
}