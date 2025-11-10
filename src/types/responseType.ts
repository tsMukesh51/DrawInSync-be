import { type Context } from 'hono';
import { type ContentfulStatusCode } from 'hono/utils/http-status';

type messageType = "No Action" | "Action on User Completed" | "Action on User Failed" | "Actions on Board Complete" | "Actions on Board Failed"
  | "Actions on Element Complete"
  | "Actions on Element Failed";
type responseType = 'success' | 'error' | 'warning';

interface ApiResponse<T = unknown> {
  message: string;
  // messageType: messageType;
  responseType: responseType;
  data?: T;
  warning?: string;
  error?: string;
}


export function createResponse<T>(c: Context, payload: ApiResponse<T>, status: ContentfulStatusCode = 200) {
  return c.json<ApiResponse<T>>(payload, status);
}
