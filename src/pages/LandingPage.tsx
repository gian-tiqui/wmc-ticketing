import { Button } from "primereact/button";
import PageTemplate from "../templates/PageTemplate";
import { useNavigate } from "react-router-dom";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import polygon3 from "..//assets/polygon-3.png";
import polygon4 from "..//assets/polygon-4.png";
import polygon5 from "..//assets/polygon-5.png";
import logo from "..//assets/wmcLogo.png";
import { Image } from "primereact/image";
import { motion } from "motion/react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedInStore();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/ticket");
    }
  }, [isLoggedIn, navigate, user]);

  return (
    <PageTemplate>
      <main className="relative w-screen h-full p-6 bg-[#CBD5E1] place-content-center">
        <motion.div className="absolute right-0 w-[400px] h-[400px] bottom-44">
          <Image src={polygon3} alt="polygon-3" className="animate-pulse" />
        </motion.div>

        <div className="absolute left-14 w-96 h-96 bottom-28">
          <Image src={polygon4} alt="polygon-4" className="animate-pulse" />
        </div>

        <div className="absolute h-20 bottom-72 w-96 left-1/2 -translate-x-2/4">
          <Image src={polygon5} alt="polygon-5" />
        </div>

        <div className="absolute flex justify-center w-24 h-20 -translate-x-1/2 left-1/2">
          <Image src={logo} alt="wmc-logo" className="w-16 h-16" />
        </div>
        <section className="bg-[#CBD5E1] w-full mx-auto h-full rounded-3xl grid place-content-center">
          <div>
            <h4 className="mb-10 font-serif text-6xl font-semibold tracking-wide text-blue-600">
              A New Ticketing System
            </h4>
            <p className="mb-10 font-serif text-xl font-medium text-center text-slate-800">
              Developed for{" "}
              <span className="font-semibold text-blue-600">
                Westlake Medical Center
              </span>{" "}
              Internal
            </p>
            <div className="absolute z-20 p-2 -translate-x-2/4 bg-[#CBD5E1] left-1/2 bottom-32 rounded-full">
              <Button
                onClick={() => navigate("/login")}
                className="flex justify-center text-xl font-serif mx-auto border-none font-bold h-16 w-72 bg-[#EEEEEE]/70 hover:bg-blue-600 hover:text-white shadow text-blue-600 rounded-full"
              >
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="absolute bottom-0 w-full h-44 bg-[#EEEEEE]/30 backdrop-blur shadow rouded-t rounded-t-full"></footer>
    </PageTemplate>
  );
};

export default LandingPage;
