import dotenv from 'dotenv';
dotenv.config()

export const MONGO_SERVER = process.env.MONGO_SERVER
export const MONGO_DB = process.env.MONGO_DB
export const PORT = Number(process.env.PORT) || 8080
export const MONGO_COLLECTION_ACTIVITIES = process.env.MONGO_COLLECTION_ACTIVITIES || ''