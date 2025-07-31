import { useLocation } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";

const CloseTicketPage = () => {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const token = queryParams.get("token");

  return <PageTemplate>{token}</PageTemplate>;
};

export default CloseTicketPage;
