const TOPICS = {
  consulting: "Consulting inquiry",
  collaboration: "Project collaboration",
  general: "General question",
  other: "Something else",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const oneLine = (s) => s.replace(/[\r\n]+/g, " ");

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ ok: false, error: "Invalid form submission." }, 400);
    }
    const field = (k) => String(form.get(k) ?? "").trim();

    // Honeypot: real visitors never see or fill this field.
    if (field("website")) return json({ ok: true });

    const name = field("name");
    const email = field("email");
    const topic = field("subject");
    const message = field("message");

    if (
      !name || name.length > 100 ||
      !EMAIL_RE.test(email) || email.length > 254 ||
      !TOPICS[topic] ||
      message.length < 50 || message.length > 5000
    ) {
      return json({ ok: false, error: "Please check the form fields and try again." }, 400);
    }

    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: field("cf-turnstile-response"),
        remoteip: request.headers.get("CF-Connecting-IP") ?? "",
      }),
    });
    const outcome = await verify.json();
    if (!outcome.success) {
      return json({ ok: false, error: "Spam check failed. Please reload the page and try again." }, 403);
    }

    try {
      await env.EMAIL.send({
        from: { email: env.FROM_ADDRESS, name: "chronopax.com contact form" },
        to: env.TO_ADDRESS,
        replyTo: { email, name: oneLine(name) },
        subject: `[chronopax.com] ${TOPICS[topic]} from ${oneLine(name)}`,
        text: [
          `Name:  ${name}`,
          `Email: ${email}`,
          `Topic: ${TOPICS[topic]}`,
          `Site:  ${outcome.hostname ?? "unknown"}`,
          "",
          message,
        ].join("\n"),
      });
    } catch (err) {
      console.error("send failed", err);
      return json({ ok: false, error: "Your message couldn't be sent. Please try again later or reach out on LinkedIn." }, 502);
    }

    return json({ ok: true });
  },
};
