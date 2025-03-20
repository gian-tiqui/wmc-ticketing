import { Button } from "primereact/button";
import PageTemplate from "../templates/PageTemplate";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect } from "react";
import useUserDataStore from "../@utils/store/userDataStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedInStore();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/tickets");
    }
  }, [isLoggedIn, navigate, user]);

  return (
    <PageTemplate>
      <main className="grid h-full place-content-center">
        <section className="flex flex-col items-center gap-12">
          <p className="text-4xl font-medium">Introducing</p>

          <h4 className="text-5xl font-bold tracking-tighter text-blue-400">
            WMC <span className="text-slate-100"> Ticketing System</span>
          </h4>
          <Button
            onClick={() => navigate("/login")}
            className="flex justify-center text-xl font-bold w-72"
            icon={`pi pi-user me-2 text-xl`}
          >
            Login
          </Button>
        </section>
      </main>
      <Footer />
    </PageTemplate>
  );
};

export default LandingPage;
