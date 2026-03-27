import mongoose from "mongoose";
import Order from "./order.model";
import User from "./user.model";

export interface IDelivery {
  _id: mongoose.Types.ObjectId
  order: mongoose.Types.ObjectId
  broadcastedTo: mongoose.Types.ObjectId[]
  assignedTo: mongoose.Types.ObjectId | null
  status: 'broadcasted' | 'assigned' | 'completed'
  acceptedAt: Date
  createdAt?: Date
  updatedAt: Date
}

const deliverySchema = new mongoose.Schema<IDelivery>({
  order: {type: mongoose.Types.ObjectId, ref: Order, required: true},
  broadcastedTo: [{type: mongoose.Types.ObjectId, ref: User}],
  assignedTo: {type: mongoose.Types.ObjectId, ref: 'User'},
  status: {type: String, enum: ['broadcasted', 'assigned', 'completed'], default: 'broadcasted'}
}, {timestamps: true})

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema)
export default Delivery