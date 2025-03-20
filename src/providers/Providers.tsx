import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteProvider from "../routes/RouteProvider";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

const Providers = () => {
  const reactQueryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={reactQueryClient}>
        <PrimeReactProvider value={{ unstyled: false, pt: {}, ripple: true }}>
          <RouteProvider />
        </PrimeReactProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
