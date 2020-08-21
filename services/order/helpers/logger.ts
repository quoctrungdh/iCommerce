import winston, { format } from 'winston';
import fluentLogger from 'fluent-logger'
import { FLUENTD_HOST } from '../constants'
const { combine, errors, timestamp } = format;

const print = format.printf((info) => {
  const log = `${info.timestamp}:${info.level}: ${info.message}`;

  return info.stack
    ? `${log}\n${info.stack}`
    : log;
});

function loggerHandler() {
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
    fluent = new fluentTransport('order.service', config);
    
  } catch(error) {
    console.log(error.message)
  }

  const wlogger = winston.createLogger({
    format: combine(
      errors({ stack: true }), // <-- use errors format
      timestamp(),
      print
    ),
    transports: [fluent, new (winston.transports.Console)()]
  });
  
  wlogger.on('finish', () => {
    fluent.sender.end("end", {}, () => {})
  });

  const loggerCombineMsg = (fns: Function) => {
    return (...messages: any) => {
      const combinedMsg = messages.join('|')
      fns(combinedMsg)
    }
  }

  return {
    info: loggerCombineMsg(wlogger.info),
    error: loggerCombineMsg(wlogger.error),
    debug: loggerCombineMsg(wlogger.debug)
  }
}

export default loggerHandler()