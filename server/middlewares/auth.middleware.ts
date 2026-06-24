import type { NextFunction, Request,Response } from "express"
import  jwt, { decode }  from "jsonwebtoken";

const UserAuthMiddleware =async(req:Request,res:Response,next:NextFunction)=>{
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const header = req.headers["authorization"];

    if(!header){
        res.status(401).json({
            "message":"No header",
        })
        return
    }
    const token = header;
    try{
        const decoded = jwt.verify(token as string , JWT_SECRET)
        //@ts-ignore
        req._id = decoded._id;
        next();
    }catch (err) {
        return res.status(403).json({
            message: "You are not logged in",
            error:err,
            tokens:header
        });
    }
}
export default UserAuthMiddleware;