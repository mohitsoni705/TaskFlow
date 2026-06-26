
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Logo } from '../Icons/Logo';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { BACKEND_URL } from '../config/config';
import { LeftChevron } from '../Icons/Icon';
const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();
  const usernameRef = useRef<any>("");

  const role = localStorage.getItem("selectedRole");
  const emailVerifier=(email:string)=>{
     for(let i = 0 ; i<email.length; i++){
        if(email[i]=='@'){
          return true;
        }
     }
     return false;
  }
  const signin = async () => {
    const na  = usernameRef.current?.value;
    const em = emailRef.current?.value;
    const pass = passwordRef.current?.value;
    const name = na.trim().toLowerCase();
    const email = em.trim().toLowerCase();
    if (!email || !pass || !name) {
      setError("Please fill all fields");
      return;
    }
    if(!emailVerifier(email)){
      setError("Please enter correct email id");
      return;

    }
    try {
      setError("");
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { name ,pass,email });
      const token = res.data.token;
      console.log(res);
      localStorage.setItem("token", token);
      setLoading(false);
      navigate(`/dashboard`);
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen w-full'>
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
      <div className='w-full md:w-1/2 flex flex-col justify-center'>
        <div className='flex flex-col items-center justify-center gap-3 px-6 p-4 '>
          <div className='relative md:w-1/2 w-full flex flex-row items-center justify-center '>
            <div className='absolute left-0 cursor-pointer '>
              <span onClick={() => navigate(-1)}>
                <LeftChevron />
              </span>
            </div>
            <div className='text-center text-2xl mb-4 font-bold text-gray-800'>
              Sign in
            </div>
          </div>
          <div className='w-full max-w-md'>
            <div className='flex gap-4 flex-col'>
              <Input placeholder="Enter Your Usernanme" reference={usernameRef} />
              <Input placeholder="Enter Your Email" reference={emailRef} />
              <Input placeholder="Enter Your Password" variant="password" reference={passwordRef} />
            </div>
            <p className=' text-[#407CE2] cursor-pointer  font-semibold text-right my-3'>
              Forget Password?
            </p>
            {error && <p className='text-red-500 text-sm mb-4 text-center font-medium'>{error}</p>}
            <Button innerText="Sign in" variant="primary" onClick={signin} loading={loading} />
            {role==="admin"?
            <div className='text-center text-sm text-gray-600 mt-4'>
              Don't have an account?{" "}
              <span className='text-blue-500 font-medium cursor-pointer'>
                <Link to="/signup">Sign Up</Link>
              </span>
            </div>
            :<div className='text-center text-sm text-blue-600 mt-4'>Contact Administrator For any issue</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
