import { Request } from "express";
export declare const getlatestProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getAllCategories: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getAllProducts: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getAdminProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const getSigleProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const newProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const updateProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
export declare const deleteProduct: (req: Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void | import("express").Response<any, Record<string, any>>>;
