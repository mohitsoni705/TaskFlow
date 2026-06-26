import { Logo } from "../Icons/Logo";
import ThemeToggle from "./ThemeToggle";

const AuthTopBar = () => {
  return (
    <header className="flex md:hidden items-center justify-between bg-purple-600 dark:bg-purple-800 px-5 py-4">
      <div className="flex items-center gap-2.5 text-white">
        <div className="text-2xl">
          <Logo />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold">Task Flow</span>
          <span className="text-xs font-medium text-purple-200">Productivity Tool</span>
        </div>
      </div>
      <ThemeToggle className="text-white hover:bg-purple-700/80 dark:hover:bg-purple-900/80" />
    </header>
  );
};

export default AuthTopBar;
