// import { password } from "bun";
import mongoose ,{model , Schema} from "mongoose";

export interface IUser{
    name:string,
    email:string,
    password:string
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  {
    timestamps: true,
  }
);


export const UserModel = model("User",userSchema);

export const nameExist=async(name:string) =>await UserModel.findOne({name});
export const mailExist = async(email:string)=>await UserModel.findOne({email});
export const createUser = async({name,email,password}:IUser)=>{
       const newUser = new UserModel({
        name:name,
        email:email,
        password:password
       });
       const savedUser = await newUser.save();
}