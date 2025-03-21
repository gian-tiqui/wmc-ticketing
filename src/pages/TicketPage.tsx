import { useParams } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "../@utils/services/ticketService";
import { useEffect } from "react";

const TicketPage = () => {
  const param = useParams();

  const {
    data: ticketData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: [`ticket-${param.ticketId}`],
    queryFn: () => {
      if (!param.ticketId) {
        throw new Error("Ticket ID is undefined");
      }
      return getTicketById(parseInt(param.ticketId, 10));
    },
    enabled: !!param.ticketId,
  });

  useEffect(() => {
    console.log(ticketData?.data.status);
  }, [ticketData]);

  if (isLoading) return <p>Loading ticket...</p>;

  if (ticketData?.status === 404) return <p>Ticket not found</p>;

  if (isError) return <p>Error loading ticket: {error.message}</p>;

  return (
    <PageTemplate>
      <h1>Ticket ID: {param.ticketId}</h1>
      {/* Render ticket data here */}
    </PageTemplate>
  );
};

export default TicketPage;
