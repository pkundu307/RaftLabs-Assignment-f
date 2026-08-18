const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  data?: unknown,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error =
      typeof body === "object" && body !== null && "message" in body
        ? new ApiError(String(body.message), response.status)
        : new ApiError(body || "Something went wrong", response.status);
    throw error;
  }

  return body as T;
}

export const apiClient = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, "GET"),
  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, "POST", data),
  patch: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, "PATCH", data),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, "DELETE"),
};
