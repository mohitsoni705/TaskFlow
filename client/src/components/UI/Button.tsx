import type { ReactElement } from "react";


interface ButtonProps{
  innerText:String,
  variant?:String,
  onClick?:()=>void,
  loading?:boolean,
  size?:String,
  frontIcon?:ReactElement,
  BackIcon?:ReactElement
}
const variants = {
  primary: "w-full bg-purple-600 hover:bg-purple-500 active:bg-blue-700 text-white rounded-full",
  secondary: "w-full bg-white text-purple-500 border border-purple-500 rounded-full ",
  square:"w-full bg-purple-600 hover:bg-purple-500 active:bg-blue-700 text-white rounded-sm ",
  green: "bg-green-500 text-white border border-green-600 hover:bg-gradient-to-r hover:from-green-400 hover:to-green-300 rounded-full ",
  blue: "  bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg rounded-full "
}as any;

const sizes ={
  md:" px-10 py-2 ",
  sm:" px-5 py-2 ",
  lg:" px-20 py-4 " 
}as any;
const defaultDesign =
  " font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg ";

const Button = ({ innerText, variant = "primary" ,onClick, loading , size = "lg" , frontIcon }:ButtonProps) => {
  return (
    <button 
      className={`${defaultDesign} ${variants[variant as any]} ${sizes[size as any]} ${loading ? "opacity-70 cursor-not-allowed" : ""}`} 
      onClick={loading ? undefined : onClick}
      disabled={loading}
    >
      <div className="flex flex-row items-center gap-1 justify-center ">
      <span>{frontIcon}</span>
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span >{loading ? "Loading..." : innerText}</span>
      </div>
        </div>
    </button>
  );
};

export default Button;