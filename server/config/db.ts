import mongoose from "mongoose";


export const connectDb = async()=>{
    try{
        mongoose.connect(`mongodb+srv://mohitsoni3820_db_user:m0hit@mohitcluster.dixlj3c.mongodb.net/taskFlow`);
        console.log("Mongodb connected successfully")
    }catch(e:any){
        console.error("MongoDb error",e.message);
    }
}