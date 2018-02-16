
const randomHexChar = (chars: number): string => {
  return Array(chars).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

const pseudoUUID = () => {
    return `${randomHexChar(4)}-${randomHexChar(4)}-${randomHexChar(4)}-${randomHexChar(4)}`
};

export const appendUUID = (str: string) => {
    return `${str}-${pseudoUUID()}`
};

