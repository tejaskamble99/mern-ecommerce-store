declare class ErrorHandeler extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export default ErrorHandeler;
