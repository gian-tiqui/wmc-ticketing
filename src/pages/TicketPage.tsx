import { useNavigate, useParams } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { URI } from "../@utils/enums/enum";
import TicketHeader from "../components/TicketHeader";
import TicketTab from "../components/TicketTab";
import { useEffect } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import roleIncludes from "../@utils/functions/rolesIncludes";
import TicketSkeleton from "../components/TicketSkeleton";
import apiClient from "../@utils/http-common/apiClient";

const TicketPage = () => {
  const param = useParams();
  const navigate = useNavigate();
  const { user } = useUserDataStore();

  const fetchTicket = async (ticketId: number) => {
    try {
      const response = await apiClient.get(
        `${URI.API_URI}/api/v1/ticket/${ticketId}`
      );
      return response.data;
    } catch (err: unknown) {
      const error = err as { response: { status: number } };
      if (error.response && error.response.status === 404) {
        throw new Error("NOT_FOUND");
      }
      throw new Error("ERROR_LOADING");
    }
  };

  const {
    data: ticketData,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: [`ticket-${param.ticketId}`],
    queryFn: () => {
      if (!param.ticketId) {
        throw new Error("Ticket ID is undefined");
      }
      return fetchTicket(+param.ticketId);
    },
    enabled: !!param.ticketId,
    retry: false,
  });

  useEffect(() => {
    if (
      !roleIncludes(user, "admin") &&
      ticketData &&
      ticketData.ticket.issuerId !== user?.sub
    ) {
      navigate("/unauthorized");
    }
  }, [user, ticketData, navigate]);

  if (isLoading) return <TicketSkeleton />;

  if (isError) {
    if (error.message === "NOT_FOUND") {
      return (
        <PageTemplate>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="p-8 text-center bg-[#EEE] backdrop-blur-sm rounded-2xl shadow-lg border border-[#CBD5E1]/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#CBD5E1] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Ticket Not Found
              </h3>
              <p className="mb-6 text-gray-600">
                The ticket you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate("/ticket")}
                className="px-6 py-2 bg-[#CBD5E1] hover:bg-[#B0BEC5] text-gray-800 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Tickets
              </button>
            </div>
          </div>
        </PageTemplate>
      );
    }
    return (
      <PageTemplate>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="p-8 text-center bg-[#EEE] backdrop-blur-sm rounded-2xl shadow-lg border border-[#CBD5E1]/30">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#CBD5E1] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="mb-6 text-gray-600">
              We encountered an error while loading the ticket. Please try
              again.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-[#CBD5E1] hover:bg-[#B0BEC5] text-gray-800 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/ticket")}
                className="px-6 py-2 bg-[#EEE] hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors duration-200"
              >
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <TicketHeader ticket={ticketData.ticket} refetch={refetch} />
        <div className="px-4 pb-8 mt-5">
          <div className="bg-[#EEE] backdrop-blur-sm rounded-2xl shadow-lg border border-[#CBD5E1]/30 overflow-hidden">
            <TicketTab ticket={ticketData.ticket} refetch={refetch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
