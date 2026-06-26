export const Loader2 = () => {
  return(
         <div className="flex justify-center items-center">
                        <div className=" w-5 h-5 border-4 border-[#5046e4] border-t-transparent rounded-full animate-spin"></div>
                    </div>
  )
}
const Loader = () => {
  return (
<div className="flex flex-row gap-2">
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
</div>
  )
}

export default Loader
