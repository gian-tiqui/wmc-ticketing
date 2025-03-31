import { CreateTicket, Query, UpdateTicket } from "../../types/types";
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

const updateTicketById = (ticketId: number, body: UpdateTicket) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/ticket/${ticketId}`, {
    ...body,
  });
};

const uploadServiceReport = async (ticketId: number, formData: FormData) => {
  return apiClient.post(
    `${URI.API_URI}/api/v1/ticket/${ticketId}/serviceReport`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketById,
  uploadServiceReport,
};
