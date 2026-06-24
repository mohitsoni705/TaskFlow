import { createUser, nameExist , mailExist, UserModel } from "../models/user.model.ts";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";``
import jwt from "jsonwebtoken";


export const signUp = async(req:Request,res:Response)=>{
    const {name, pass , email}  = req.body;
    const existingName= await nameExist(name);
    if(existingName){
        return res.status(401).json({
            "message":"Username already exist"
        })
    }
    const existingMail= await mailExist(email);
    if(existingMail){
        return res.status(401).json({
            "message":"Mail id already exist"
        })
    }
    const password = await bcrypt.hash(pass, 5);
    await createUser({name,email,password});
    res.json({
        "message":"user created successfully"
    })
}

export const login = async(req:Request,res:Response)=>{
    const {username,email,pass}=req.body;
    const existing = await UserModel.find({email});
    console.log(existing);
    const check = await bcrypt.compare(pass,existing[0]?.password as string);
    if(!check){
        return res.status(401).json({
            "message":"Invalid credentials"
        })
    }
    const token = jwt.sign({user_id:existing[0]?._id , username:username},process.env.JWT_SECRET as string);
    res.json({
        token,
        msg:"You have signed up successfully"
    })
}