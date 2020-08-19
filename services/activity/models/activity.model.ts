import mongoose from "mongoose";
import { MONGO_COLLECTION_ACTIVITIES } from '../constants'
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  type: {
    type: String,
    enum: ['SEARCH', 'FILTER', 'VIEW'],
    required: true
  },
  data: {
    type: String
  },
  host: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
});

export default mongoose.model(MONGO_COLLECTION_ACTIVITIES, ActivitySchema);
