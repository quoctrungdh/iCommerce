import mongoose from 'mongoose';
import { MONGO_COLLECTION_PRODUCTS } from '../constants';
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    }
  },
  { versionKey: false }
);

export default mongoose.model(MONGO_COLLECTION_PRODUCTS, ProductSchema);
