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
                className: "bg-[#EEEEEE]  text-sm",
              },
              headerTitle: { className: "text-lg font-medium" },
              content: {
                className: "bg-[#EEEEEE]  text-sm",
              },
              footer: {
                className: "bg-[#EEEEEE] text-xs",
              },
              acceptButton: { className: "bg-blue-600 text-xs" },
              rejectButton: { className: "text-xs" },
              icon: { className: "text-lg" },
            }}
            maskClassName="backdrop-blur"
          />
          <RouteProvider />
        </PrimeReactProvider>
      </QueryClientProvider>
    </>
  );
};

export default Providers;
