import { FC } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown";

interface TProps {
  email?: string;
  onOpenUser: () => void;
}
const DropdownUser: FC<TProps> = ({ email, onOpenUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger id="dropdown-email" className="focus-visible:outline-none hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2 rounded-md">
        {email}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuItem
          className="flex gap-2 hover:cursor-pointer hover:bg-slate-50"
					id="dropdown-item-setting"
          onClick={onOpenUser}
        >
          <AiOutlineSetting className="text-sm w-5 h-5" />
          <p>Setting</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUser;
