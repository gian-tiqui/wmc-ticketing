enum Namespace {
  BASE = "WMC_TICKETING_SYSTEM",
}

enum URI {
  API_URI = import.meta.env.VITE_API_URI || "http://10.10.10.30:8084",
}

export { Namespace, URI };
