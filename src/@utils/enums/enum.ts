enum Namespace {
  BASE = "WMC_TICKETING_SYSTEM",
}

enum URI {
  API_URI = import.meta.env.VITE_API_URI || "http://10.10.10.30:8084",
}

enum TicketStatus {
  NEW = 1,
  ACKNOWLEDGED = 2,
  ASSIGNED = 3,
  ESCALATED = 4,
  RESOLVED = 5,
  CLOSED = 6,
  CLOSED_RESOLVED = 7,
  CANCELLED = 8,
  ON_HOLD = 9,
}

export { Namespace, URI, TicketStatus };
