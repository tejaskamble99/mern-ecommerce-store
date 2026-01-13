import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
export declare const connectDB: () => Promise<void>;
export declare const invalidateCache: ({ product, order, admin, userId, orderId, productId, }: InvalidateCacheProps) => Promise<void>;
export declare const reduceStock: (orderItems: OrderItemType[]) => Promise<void>;
export declare const calculatePercentage: (thisMonth: number, lastMonth: number) => number;
export declare const getInventories: ({ categories, productsCount, }: {
    categories: string[];
    productsCount: number;
}) => Promise<Record<string, number>[]>;
