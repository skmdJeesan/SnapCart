import mongoose from "mongoose";
import User, { IUser } from "./user.model";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | IUser;
  items: [
    {
      groceryId: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    }
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  status: "pending" | "out for delivery" | "delivered" | "cancelled";
  address: {
    name: string;
    mobile: string;
    fullAddress: string;
    city: string;
    state: string;
    pinCode: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId
  assignedDeliveryBoy?: mongoose.Types.ObjectId | IUser
  deliveryOtp: string;
  deliveryOtpVerification: Boolean;
  deliveredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      groceryId: { type: mongoose.Types.ObjectId, ref: "Grocery", required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
      unit: { type: String, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  isPaid: { type: Boolean, default: false },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cod", "online"], required: true, default: "cod" },
  status: { type: String, enum: ["pending", "out for delivery", "delivered", "cancelled"], default: "pending" },
  address: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  assignment: {type: mongoose.Types.ObjectId, ref: 'Delivery'},
  assignedDeliveryBoy: {type: mongoose.Types.ObjectId, ref: User},
  deliveryOtp: { type: String, default: null },
  deliveryOtpVerification: { type: Boolean, default: false },
  deliveredAt: Date,
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
