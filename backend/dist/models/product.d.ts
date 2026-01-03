import mongoose from "mongoose";
export declare const Product: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}, {}, {
    timestamps: true;
    strict: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    strict: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
    strict: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    photo: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
