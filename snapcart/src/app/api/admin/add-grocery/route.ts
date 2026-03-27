import { auth } from "@/src/auth";
import uploadOnCloudinary from "@/src/lib/cloudinary";
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

    const formData = await req.formData()
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const price = formData.get('price') as string
    const unit = formData.get('unit') as string
    const file = formData.get('image') as File | null

    let imageUrl = ''
    if(file) {
      const uploadResult: any = await uploadOnCloudinary(file)
      imageUrl = uploadResult || ''
    }

    if (!imageUrl) throw new Error("Image upload failed");
    
    const grocery = await Grocery.create({name, category, price, unit, image: imageUrl})
    return NextResponse.json( 
      grocery,
      {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
      {message: `Error in add grocery : ${error}`},
      {status: 500}
    )
  }
}