import mongoose from 'mongoose'
import { MONGO_SERVER, MONGO_DB } from '../constants';
import logger from '../helpers/logger'

export async function initDatabase() {
  if(!MONGO_SERVER) {
    throw new Error("Mongo Server is not found")
  }

  if(!MONGO_DB) {
    throw new Error("Mongo DB is not found")
  }

  mongoose.Promise = global.Promise;
  const readyStatus = ['disconnected', 'connected', 'connecting', 'disconnecting']

  const dbClient = await mongoose.connect(`${MONGO_SERVER}/${MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  // Get the default connection
  const db = dbClient.connection;
  logger.info("DB readyState", readyStatus[db.readyState])
  
  
  db.once('open', function(res){
    logger.info('db connection open', JSON.stringify(res));
  });

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
