declare global {
    namespace Express {
        interface Request {
            UUID?: string;
        }
    }
}

export {};
