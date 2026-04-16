import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    _id: string;
    gender: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    photo: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    description: string;
    category: string;
}

export type  Controllertype = (
    req: Request,
    res:Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type SearchRequestQuery = {
    search? : string;
    category?: string;
    sort?: string;       
    price?: string;
    page?: string;  
}

export interface BaseQuery {
    name?:{
        $regex : string;
        $options : string;
    };
    price?:{
       
        $lte : number
    };
    category?:  string;
}


export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  review?: boolean;
  _id?: string;
  orderId?: string;
  productId?: string | string[];
}

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  fullName?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  orderItems: OrderItemType[];
  paymentMethod?: "Stripe" | "COD" | "Razorpay";
  couponCode?: string;
  paymentIntentId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
   paymentInfo?: {
    gateway: string;
    paymentId: string;
    gatewayOrderId?: string;
    signature?: string;
    status?: string;
  };
}
