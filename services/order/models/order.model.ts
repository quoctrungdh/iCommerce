import mongoose from "mongoose";
import { MONGO_COLLECTION_ORDERS } from '../constants'
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const FileSchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  product: { type: ObjectId, ref: "products", required: true },
  type: { 
    type: String,
    enum: ['PENDING', 'PAID', 'PACKING', 'DELIVERING', 'COMPLETED', 'CANCELED'],
    default: 'PENDING'
  },
  address: { 
    type: String,
    required: true
  },
  phoneNumber: { 
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true
  }
});

export default mongoose.model(MONGO_COLLECTION_ORDERS, FileSchema);
