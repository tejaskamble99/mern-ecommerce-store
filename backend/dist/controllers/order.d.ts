import { Request } from "express";
export declare const myOrders: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const allOrders: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getSingleOrder: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const newOrder: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const processOrder: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const deleteOrder: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
