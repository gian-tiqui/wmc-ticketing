import { CreateTicket, Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createTicket = (createTicketDto: CreateTicket) => {
  return apiClient.post(`${URI.API_URI}/api/v1/ticket`, { ...createTicketDto });
};

const getTickets = (params: Query) => {
  return apiClient.get(`${URI.API_URI}/api/v1/ticket`, { params });
};

const getTicketById = (ticketId: number) => {
  return apiClient.get(`${URI.API_URI}/api/v1/ticket/${ticketId}`);
};

export { createTicket, getTickets, getTicketById };
