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
      return <p>Ticket not found</p>;
    }
    return <p>Error loading ticket. Please try again later.</p>;
  }

  return (
    <PageTemplate>
      <div className="w-full h-full">
        <TicketHeader ticket={ticketData.ticket} refetch={refetch} />
        <TicketTab ticket={ticketData.ticket} refetch={refetch} />
      </div>
    </PageTemplate>
  );
};

export default TicketPage;
