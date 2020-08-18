import mongoose from 'mongoose'
import { MONGO_SERVER, MONGO_DB } from '../constants';

export async function initDatabase() {
  if(!MONGO_SERVER) {
    throw new Error("Mongo Server is not found")
  }

  if(!MONGO_DB) {
    throw new Error("Mongo DB is not found")
  }

  const mongoServer = `mongodb://${MONGO_SERVER.split(',').map(elm => `${elm}:27017`).join(',')}`

  mongoose.Promise = global.Promise;

  await mongoose.connect(mongoServer, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: MONGO_DB
  })

  // Get the default connection
  const db = mongoose.connection;
  

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
