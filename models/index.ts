import {Request} from "express";
import {UserDetails} from "./User";

export interface AuthenticatedRequest extends Request {
    user?: UserDetails;
}