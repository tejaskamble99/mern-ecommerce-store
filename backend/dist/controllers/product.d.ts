import { Request } from "express";
export declare const newProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getlatestProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
