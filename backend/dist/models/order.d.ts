import mongoose from "mongoose";
export declare const Order: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user: mongoose.Types.ObjectId;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    orderItems: mongoose.Types.DocumentArray<{
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }> & {
        name: string;
        photo: string;
        price: number;
        quantity: number;
        productId: mongoose.Types.ObjectId;
    }>;
    shippingInfo?: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
