import { PrimeIcons } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { TabPanel, TabView } from "primereact/tabview";
import UserDetails from "./UserDetails";

const TicketSkeleton = () => {
  return (
    <div className="w-full h-screen bg-inherit">
      <div className="flex items-center gap-3 px-5 pt-5 mb-4">
        <Skeleton className="!h-5 !w-20 bg-slate-600" />
        <p className="text-xl">/</p>
        <Skeleton className="!h-5 !w-20 bg-slate-600" />
      </div>
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="!h-10 !w-10 bg-slate-600" />
          <Skeleton className="!h-5 !w-28 bg-slate-600" />
        </div>
        <Skeleton className="!h-7 !w-7 bg-slate-600" />
      </div>
      <TabView
        pt={{
          panelContainer: { className: "h-full bg-inherit" },
          nav: { className: "bg-inherit" },
        }}
      >
        <TabPanel
          header={<Skeleton className="bg-slate-600 !h-5 !w-28" />}
          pt={{
            content: { className: "h-80 bg-inherit text-slate-100" },
            header: { className: "bg-inherit" },
            headerAction: { className: "bg-inherit" },
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="bg-slate-600 !h-20 col-span-2" />
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="bg-slate-600 !h-20" />
                ))}{" "}
            </div>
            <div className="relative rounded-lg h-96 bg-slate-900">
              <div className="absolute w-full bg-blue-500 rounded-t-xl h-[5%]"></div>
              <div className="flex flex-col gap-2 mx-4 mt-5">
                <h4 className="flex items-center gap-2 mt-4 mb-4 first:font-medium">
                  <Skeleton className="!w-5 !h-5 bg-slate-600" />
                  <Skeleton className="!w-28 !h-5 bg-slate-600" />
                </h4>
                <div className="flex items-center justify-between">
                  <UserDetails user={undefined} mode="skeleton" />

                  <i className={`${PrimeIcons.ARROW_CIRCLE_RIGHT} text-xl`}></i>
                  <UserDetails user={undefined} mode="skeleton" />
                </div>
              </div>

              <h4 className="flex items-center gap-2 mx-4 mb-3 font-medium mt-7">
                <Skeleton className="!w-5 !h-5 bg-slate-600" />
                <Skeleton className="!w-28 !h-5 bg-slate-600" />
              </h4>
              <Skeleton className="!w-[93%] bg-slate-600 !h-44 mx-auto" />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default TicketSkeleton;
