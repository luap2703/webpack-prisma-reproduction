import { NextFunction, Request, Response } from "express";
import Rollbar from "rollbar";
export declare var rollbar: Rollbar;
export default function logError(err: Error, _req: Request, _res: Response, next: NextFunction): void;
