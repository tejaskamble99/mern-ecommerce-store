import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
export declare const connectDB: () => Promise<void>;
export declare const invalidateCache: ({ product, order, admin, userId, orderId, productId, }: InvalidateCacheProps) => void;
export declare const reduceStock: (orderItems: OrderItemType[]) => Promise<void>;
export declare const calculatePercentage: (thisMonth: number, lastMonth: number) => number;
export declare const getInventories: ({ categories, productsCount, }: {
    categories: string[];
    productsCount: number;
}) => Promise<Record<string, number>[]>;
interface MyDocument {
    createdAt: Date;
    discount?: number;
    total?: number;
}
type FuncProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total";
};
export declare const getChartData: ({ length, docArr, today, property, }: FuncProps) => number[];
export {};
