import { Menu } from "lucide-react";

export function Topbar(){
  return(
    <>
      <div className="absolute w-auto h-16 bg-black text-white flex items-center px-4 rounded-xl md:left-32 top-14">
          <Menu className="w-10 h-10 border-[0.2px] rounded-md border-[#807f7d]"/>
          <h1 className="text-2xl text-[#EFE7D2] ml-2">AROENA</h1>
          <div className="flex flex-row space-x-4 mx-4">
            <a className="text-md text-[#EFE7D2]">MENU</a>
            <a className="text-md text-[#EFE7D2]">ABOUT</a>
            <a className="text-md text-[#EFE7D2]">BOOK A TABLE</a>
          </div>
      </div>
    </>)
}