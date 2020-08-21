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
    type: String
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  port: {
    type: String
  },
  prefix: {
    type: String
  },
  protocol: {
    type: String
  },
}, { versionKey: false });

export default mongoose.model(MONGO_COLLECTION_ACTIVITIES, ActivitySchema);
