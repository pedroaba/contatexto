export type ResponseStatus = Pick<ResponseInit, "status">;
export type ResponseBody = Omit<ResponseInit, "status">;

export function json<T>(
  data: T,
  responseStatus: ResponseStatus = { status: 200 },
  { headers, ...body }: ResponseBody = {},
) {
  const responseHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  return new Response(JSON.stringify(data), {
    status: responseStatus.status,
    statusText: String(responseStatus.status),
    headers: responseHeaders,
    ...body,
  });
}
