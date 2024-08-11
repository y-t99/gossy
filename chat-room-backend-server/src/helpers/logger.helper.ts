import Winston from 'winston';

const logger = Winston.createLogger();

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new Winston.transports.Console({
      format: Winston.format.simple(),
    }),
  );
}

export function getLogger() {
  return logger;
}
