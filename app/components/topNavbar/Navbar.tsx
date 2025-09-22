import { Phone, Mail } from "lucide-react";
export default function Navbar() {
  return (
    <div className="bg-[#232323] md:block hidden relative min-h-[90px] flex items-center text-white">

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center min-w-[120px]">
        <img src="/Logo.png" alt="Logo" className="h-[70px] mx-auto mb-1" />
      </div>

      <div className="absolute right-[20%] top-1/2 transform -translate-y-1/2 flex flex-col items-end gap-2 text-white text-[15px]">
        <a
          href="https://wa.me/18006793415"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        ><Phone className="w-4 h-4 text-white" />
          +1 800 679 3415</a>


        <a href="mailto:info@dsllimoservice.com" className="flex items-center gap-1"><Mail className="w-4 h-4 text-white" />
          <span>info@dsllimoservice.com</span></a>


      </div>
    </div>
  );
}