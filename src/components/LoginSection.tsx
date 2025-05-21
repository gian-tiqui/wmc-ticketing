import { Image } from "primereact/image";
import wmcBuilding from "../assets/bg-removed-wmc.png";

const LoginSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src={wmcBuilding}
        alt="wmc building"
        className="h-[1000px] w-[1000px] absolute  -bottom-72 left-0 opacity-45"
      />
      <h1 className="absolute top-0 left-0 px-2 font-serif text-4xl font-bold text-slate-50 backdrop-blur">
        HOSPITAL AT THE HEART OF LAGUNA
      </h1>

      <h1 className="absolute bottom-0 right-0 px-2 font-serif font-bold text-slate-100 text-7xl backdrop-blur">
        CENTERS OF CARE
      </h1>
    </div>
  );
};

export default LoginSection;
