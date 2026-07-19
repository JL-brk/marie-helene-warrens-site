export async function onRequestPost(context) {
  const request = context.request;
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 24_000) {
    return Response.json({ ok: false, error: "request_too_large" }, { status: 413 });
  }

  try {
    const response = await context.env.CONTACT_SERVICE.fetch(request);
    return new Response(response.body, response);
  } catch {
    return Response.json({ ok: false, error: "service_unavailable" }, { status: 503 });
  }
}

export function onRequest() {
  return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
