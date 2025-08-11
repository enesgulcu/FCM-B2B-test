import HomeContainer from "@/containers/Home";
import Bakimda from "@/components/Bakimda";

export default function Home() {
  return (
    <div className="w-full h-full">
      {
        <Bakimda /> 
        // <HomeContainer /> 
      }
    </div>
  );
}
