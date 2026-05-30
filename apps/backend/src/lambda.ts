import { app } from "./index";

const fetch = globalThis.fetch;

export const handler = async (event: any) => {
  const method = event.httpMethod || event.requestContext?.http?.method || "GET";
  const path = event.path || event.rawPath || "/";
  const query = event.queryStringParameters
    ? "?" + new URLSearchParams(event.queryStringParameters).toString()
    : "";
  const headers = event.headers || {};
  const body = event.body
    ? event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString()
      : event.body
    : undefined;

  const url = `http://localhost${path}${query}`;

  const request = new Request(url, {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method) ? undefined : body,
  });

  const response = await app.handle(request);

  const responseBody = await response.text();
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: responseBody,
  };
};