import { NextRequest, NextResponse } from "next/server";

export type ApiHandler = (
  req: NextRequest,
  params?: any
) => Promise<NextResponse>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Success response
export const successResponse = (data: any, status: number = 200) => {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
};

// Error response
export const errorResponse = (error: string | Error, status: number = 400) => {
  const message = error instanceof Error ? error.message : error;

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
};

// Method handler for handling different HTTP methods in a single route
export const methodHandler = (
  handlers: Partial<Record<HttpMethod, ApiHandler>>
) => {
  return async (req: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      const method = req.method as HttpMethod;
      const handler = handlers[method];

      if (!handler) {
        return errorResponse(`Method ${method} not allowed`, 405);
      }

      return await handler(req, params);
    } catch (error: any) {
      console.error("API error:", error);

      // Determine status code based on error message or default to 500
      let statusCode = 500;
      if (error.message.includes("Authentication")) statusCode = 401;
      if (error.message.includes("Permission")) statusCode = 403;
      if (error.message.includes("not found")) statusCode = 404;
      if (error.message.includes("already exists")) statusCode = 409;

      return errorResponse(error, statusCode);
    }
  };
};

// Async handler to catch errors in async API routes
export const asyncHandler = (fn: ApiHandler) => {
  return async (req: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await fn(req, params);
    } catch (error: any) {
      console.error("API error:", error);

      // Determine status code based on error message or default to 500
      let statusCode = 500;
      if (error.message.includes("Authentication")) statusCode = 401;
      if (error.message.includes("Permission")) statusCode = 403;
      if (error.message.includes("not found")) statusCode = 404;
      if (error.message.includes("already exists")) statusCode = 409;
      if (error.message.includes("validation")) statusCode = 400;

      return errorResponse(error, statusCode);
    }
  };
};
