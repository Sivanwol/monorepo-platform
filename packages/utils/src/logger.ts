const createLogger = () => {
  // Client-side logger
  return {
    log: (level: string, message: string, meta?: object) =>
      console.log(level, message, meta),
    warn: (message: string, meta?: object) => console.warn(message, meta),
    info: (message: string, meta?: object) => console.log(message, meta),
    error: (message: string, meta?: object) => console.error(message, meta),
    // Add other log levels as needed
  };
};

export const logger = createLogger();
