const labels = {
  naam: "Naam",
  email: "E-mail",
  telefoon: "Telefoon",
  type: "Type aanvraag",
  tour: "Gewenste rondleiding",
  datum: "Voorkeursdatum",
  deelnemers: "Aantal deelnemers",
  taal: "Gewenste taal",
  bericht: "Bericht",
};

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[character]));

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return Response.json({ ok: false }, { status: 405 });

    const origin = request.headers.get("origin") || "";
    if (origin && !/^https:\/\/(www\.)?marie-helene\.jlstudio\.app$/.test(origin)) {
      return Response.json({ ok: false }, { status: 403 });
    }

    let data;
    try { data = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
    if (!data.naam || !data.email || !data.bericht || !data.privacy) {
      return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
    }

    const rows = Object.entries(labels).map(([key, label]) => {
      const value = data[key] || "—";
      return `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#5a6675">${label}</th><td style="padding:8px 12px;color:#0a2444">${escapeHtml(value)}</td></tr>`;
    }).join("");

    await env.EMAIL.send({
      to: "mariehelene.warrens@skynet.be",
      from: "website@jlstudio.app",
      replyTo: String(data.email),
      subject: `Websiteaanvraag · ${data.type || "Rondleiding"}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:680px"><h1 style="font-size:24px;color:#0a2444">Nieuwe aanvraag via de website</h1><table style="width:100%;border-collapse:collapse">${rows}</table></div>`,
      text: Object.entries(labels).map(([key, label]) => `${label}: ${data[key] || "—"}`).join("\n"),
    });

    return Response.json({ ok: true });
  },
};
