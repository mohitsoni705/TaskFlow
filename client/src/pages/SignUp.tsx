import { useRef, useState } from 'react'
import axios from 'axios' 
import { Link, useNavigate, } from 'react-router-dom'
import { BACKEND_URL } from '../config/config';
import { Logo } from '../Icons/Logo';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
const Signup = () => {
    const [loading , setLoading] = useState(false);
    const [warning , setWarning]= useState(""); 
    const [checkBox , setCheckBox] = useState(false);
    const usernameRef = useRef<any>("");
    const passwordRef = useRef<any>("");
    const emailRef = useRef<any>("");
    const navigate = useNavigate();

    async function signup(){
        const na = usernameRef.current?.value; 
        const email = emailRef.current?.value;
        const pass = passwordRef.current?.value;
        const name = na.trim().toLowerCase();
        try{
            setWarning("");
            setLoading(true);
            if(name === "" || pass === ""){
                setWarning("Enter credentials");
            }else{
                await axios.post(`${BACKEND_URL}/auth/signup`,{
                    name,
                    email,
                    pass    
                })
                alert("You have signed up");
                navigate("/signin")
            }
        }catch(err:any){
            setWarning(err.response?.data?.message || "Something went wrong");
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
  return (
    <div className='flex flex-col md:flex-row min-h-screen w-full'>
      {/* LEFT SIDE */}
      <div className='hidden md:flex flex-col gap-3 items-center justify-center w-1/2 bg-purple-600'>
        <div className='text-3xl text-white'>
          <Logo />
        </div>
        <div className='text-4xl text-white font-bold'>
          Task Flow
        </div>
        <div className='text-white text-xl font-semibold'>
           Productivity Tool
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='w-full md:w-1/2 flex flex-col gap-8 items-center justify-center px-6 py-4'>
        <div className='relative md:w-1/2 w-full flex flex-row items-center justify-center '>
          <div className='absolute left-0 cursor-pointer '>
            <span onClick={() => navigate(-1)}>
              {/* <LeftChevron /> */}
            </span>
          </div>
          <div className='text-center text-2xl font-bold text-gray-800'>
            Sign Up
          </div>
        </div>

        <div className='w-full max-w-md'>
          <div className='w-full max-w-md space-y-6'>
      <Input
        placeholder="Enter your name"
        leftIcon={<UserIcon />}
        reference={usernameRef}
      />
      <Input
        placeholder="Enter your email"
        leftIcon={<MailIcon />}
        reference={emailRef}
      />
      <Input
        variant="password"
        placeholder="Enter your password"
        leftIcon={<LockIcon />}
        reference={passwordRef}
      />
      <div className='flex items-center justify-center gap-3 text-sm text-gray-600'>
        <input type='checkbox' className='mt-1 w-5 h-5 rounded-2xl border-gray-300' onClick={()=>setCheckBox(!checkBox)}/>
        <p>
          I agree to the Task Flow{" "}
          <span className='text-blue-500 cursor-pointer'>Terms of Service</span>{" "}
          and{" "}
          <span className='text-blue-500 cursor-pointer'>Privacy Policy</span>
        </p>
      </div>
      {warning && <p className='text-red-500 text-sm text-center font-medium'>{warning}</p>}
      <div>
        <Button innerText="Sign Up" onClick={signup} loading={loading} />
      </div>
      <div className='text-center text-sm text-gray-600'>
        Already have an account?{" "}
        <span className='text-blue-500 font-medium cursor-pointer'>
          <Link to="/signin">Sign In</Link>
        </span>
      </div>
    </div>
        </div>
        </div>
    </div>  
  )
}

export default Signup
