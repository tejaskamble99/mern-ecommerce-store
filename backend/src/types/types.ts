import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    userId: string;
    gender: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    photo: string;
    price: number;  
    stock : number;
    description: string;
    category: string;
   
}
export type  Controllertype = (
    req: Request,
    res:Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type SeaechRequestQuery = {
    search? : string;
    category?: string;
    sort?: string;       
    price?: string;
    page?: string;  
}

export interface BaseQury {
    name?:{
        $regex : string;
        $options : string;
    };
    price?:{
        $gte :number;
        $lte : number
    };
    category?:  string;
}
