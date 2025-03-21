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
                className:
                  "bg-slate-900 text-slate-100 border-x border-t border-slate-700",
              },
              content: {
                className:
                  "bg-slate-900 text-slate-100 border-x border-slate-700",
              },
              footer: {
                className: "bg-slate-900 border-x border-b border-slate-700",
              },
            }}
          />
          <RouteProvider />
        </PrimeReactProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
