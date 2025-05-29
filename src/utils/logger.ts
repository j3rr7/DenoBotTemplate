// deno-lint-ignore-file no-explicit-any
const getTimestamp = (): string => new Date().toISOString();

const logger = {
    info: (message: string, ...args: any[]) => {
        console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
        console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
        console.error(`[${getTimestamp()}] [ERROR] ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
        if (Deno.env.get("APP_MODE") === 'development') {
            console.debug(`[${getTimestamp()}] [DEBUG] ${message}`, ...args);
        }
    },
};

export default logger;