let constRandomInt = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
export const getCorrelationId = (userId: string): string => {
    return `${userId}-${constRandomInt()}`;
};