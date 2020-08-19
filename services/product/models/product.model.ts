import mongoose from "mongoose";
import { MONGO_COLLECTION_PRODUCTS } from "../constants";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  inventory: { type: Number, default: 0 },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  images: [{ type: String, required: true }],
  description: {
    type: String,
    required: true,
  }
});

export default mongoose.model(MONGO_COLLECTION_PRODUCTS, ProductSchema);
