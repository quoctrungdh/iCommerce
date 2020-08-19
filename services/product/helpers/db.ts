import mongoose from 'mongoose'
import { MONGO_SERVER, MONGO_DB } from '../constants';

export async function initDatabase() {
  if(!MONGO_SERVER) {
    throw new Error("Mongo Server is not found")
  }

  if(!MONGO_DB) {
    throw new Error("Mongo DB is not found")
  }

  mongoose.Promise = global.Promise;

  console.log(JSON.stringify({ MONGO_SERVER, MONGO_DB, full: `${MONGO_SERVER}/${MONGO_DB}` }))

  const dbClient = await mongoose.connect(`${MONGO_SERVER}/${MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  // Get the default connection
  const db = dbClient.connection;
  console.log("readyState", db.readyState)
  /*
    0: disconnected
    1: connected
    2: connecting
    3: disconnecting
  */
  
  db.once('open', function(res){
    console.log('db connection open', JSON.stringify(res));
  });

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
