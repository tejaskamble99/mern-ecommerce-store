import mongoose from "mongoose";
export declare const Coupon: mongoose.Model<{
    coupon: string;
    amount: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    coupon: string;
    amount: number;
}, {}, mongoose.DefaultSchemaOptions> & {
    coupon: string;
    amount: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    coupon: string;
    amount: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    coupon: string;
    amount: number;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    coupon: string;
    amount: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
