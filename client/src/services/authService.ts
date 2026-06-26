import api from "./api.ts" ;

export const loginUser:any = ({name , email , password}:any)=>api.post("/login",{
    name,
    email,
    password
})
export const signup:any = ({name , email , password}:any)=>api.post("/signup",{
    name,
    email,
    password
})
