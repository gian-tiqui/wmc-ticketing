import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteProvider from "../routes/RouteProvider";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { ConfirmDialog } from "primereact/confirmdialog";

const Providers = () => {
  const reactQueryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={reactQueryClient}>
        <PrimeReactProvider value={{ unstyled: false, pt: {}, ripple: true }}>
          <ConfirmDialog
            pt={{
              header: {
                className: "bg-[#EEEEEE]  border-x border-t border-slate-700",
              },
              content: {
                className: "bg-[#EEEEEE]  border-x border-slate-700",
              },
              footer: {
                className: "bg-[#EEEEEE] border-x border-b border-slate-700",
              },
              acceptButton: { className: "bg-blue-600" },
            }}
          />
          <RouteProvider />
        </PrimeReactProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
