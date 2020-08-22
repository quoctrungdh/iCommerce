import mongoose from 'mongoose';
import { MONGO_COLLECTION_ORDERS } from '../constants';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    status: {
      type: String,
      enum: ['PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    totalPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    productID: {
      type: ObjectId,
      required: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model(MONGO_COLLECTION_ORDERS, OrderSchema);
