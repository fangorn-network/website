// ============================================
// UTILS
// ============================================
export const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const shortenCid = (cid: string): string => {
    return `${cid.slice(0, 32)}...`;
};
