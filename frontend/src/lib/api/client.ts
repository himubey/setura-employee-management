import type { ApiErrorBody } from "@/types";

/**
 * The single door between the browser and FastAPI.
 *
 * Everything the app knows about HTTP lives here: the base URL, credentials
 * behaviour, JSON encoding and error shape. Feature modules (`employees.ts`,
 * `auth.ts`, …) call `api.get` / `api.post` and deal only in typed domain
 * objects — no component ever calls `fetch` directly.
 *
 * `fetch` and not Axios: the parts of Axios we would use are interceptors and
 * JSON handling, and both are ~20 lines here.
 */

/** No trailing slash, so path joining stays a plain concatenation. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

/**
 * When true the feature modules resolve from `./mock` instead of the network,
 * so the UI runs before the FastAPI service exists. Flipped off in Phase 6.
 */
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

/** Thrown for any non-2xx response, so callers can branch on `status`. */
export class ApiError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string[]>;

  constructor(status: number, message: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }

  /** No session, or it expired — the caller should send the user to /login. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

/** Thrown when the backend could not be reached at all (DNS, refused, CORS). */
export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super(`Could not reach the API at ${API_BASE_URL}.`);
    this.name = "NetworkError";
    this.cause = cause;
  }
}

/** `undefined` and `null` entries are dropped rather than sent as "undefined". */
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function buildUrl(path: string, params?: QueryParams): string {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const queryString = search.toString();
  return queryString ? `${url}?${queryString}` : url;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  params?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", params, body, signal } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal,
      // The session is an HttpOnly cookie set by FastAPI. It is never read by
      // JavaScript, so it cannot be stolen by an XSS payload — but it does
      // have to be sent explicitly on a cross-origin request.
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    // An aborted request is the caller's own doing — let it through untouched
    // so TanStack Query can recognise the cancellation.
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new NetworkError(cause);
  }

  if (!response.ok) throw await toApiError(response);

  // 204 No Content, and 205 — there is no body to parse.
  if (response.status === 204 || response.status === 205) return undefined as T;

  return (await response.json()) as T;
}

/** Turns a failed response into an ApiError without ever throwing itself. */
async function toApiError(response: Response): Promise<ApiError> {
  let detail = `Request failed with status ${response.status}.`;
  let fields: Record<string, string[]> | undefined;

  try {
    const body = (await response.json()) as Partial<ApiErrorBody>;
    if (typeof body.detail === "string" && body.detail) detail = body.detail;
    if (body.fields) fields = body.fields;
  } catch {
    // A non-JSON error body (a proxy's HTML 502 page, say) is not worth
    // surfacing verbatim — the status-based default above is more useful.
  }

  return new ApiError(response.status, detail, fields);
}

export const api = {
  get: <T>(path: string, params?: QueryParams, signal?: AbortSignal) =>
    request<T>(path, { method: "GET", params, signal }),

  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),

  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PATCH", body, signal }),

  delete: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: "DELETE", signal }),
} as const;
