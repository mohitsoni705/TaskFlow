import { EyeIcon } from "lucide-react";
import  { useState} from "react";
import { EyeCloseIcon } from "../../Icons/EyeIcon";

const variants = {
  primary: "bg-gray-100 dark:bg-gray-800 py-4 px-5 ",
  password: "bg-gray-100 dark:bg-gray-800 py-4 px-5 ",
  secondary:"py-2 px-3 bg-gray-100 dark:bg-gray-800 "
}as any;

const defaultDesign ="w-full flex items-center gap-3 rounded-sm border border-gray-300 dark:border-gray-600 focus-within:border-gray-800 dark:focus-within:border-gray-400 transition-all";

const Input = ({
  placeholder,
  variant = "primary",
  leftIcon,reference
}:any) => {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = variant === "password";
  return (
    <div className={`${defaultDesign} ${variants[variant]}`}>
      {leftIcon && <div className="text-gray-500 dark:text-gray-400">{leftIcon}</div>}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : "text"}
        placeholder={placeholder} ref={reference}
        className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
      />
      {isPassword && (
        <div
          className="text-gray-500 dark:text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
        </div>
      )}
    </div>
  );
};

export default Input;