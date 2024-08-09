import Header from "@/components/Header";
import NavbarHeader from "@/components/NavbarHeader";
import { MdLogout } from "react-icons/md";
import Image from "next/image";



const DashboardLayout = ({ children }) => {
  return <>
  <div className=" bg-DarkBlue grid grid-cols-3 " >
  <div className="col-span-3   ">
  <Header />
  </div>
 

  

  </div>
  
  {children}</>;
};

export default DashboardLayout;
