import winston from 'winston';
import fluentLogger from 'fluent-logger'
import { FLUENTD_HOST } from '../constants'


function loggerHanlder() {
  const config = {
    host: FLUENTD_HOST,
    port: 24224,
    timeout: 3.0,
    requireAckResponse: true // Add this option to wait response from Fluentd certainly
  };
  
  console.log("config", JSON.stringify(config))
  let fluent: any
  try {
    const fluentTransport = fluentLogger.support.winstonTransport()
    fluent = new fluentTransport('product.service', config);
    
  } catch(error) {
    console.error(error)
  }

  const logger = winston.createLogger({
    transports: [fluent, new (winston.transports.Console)()]
  });
  
  logger.on('finish', () => {
    console.log("finish")
    fluent.sender.end("end", {}, () => {})
  });

  return logger
}

export default loggerHanlder()