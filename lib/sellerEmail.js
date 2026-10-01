function escapeHtml(value) {
  return String(
    value || ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;"
    );
}

/*
|--------------------------------------------------------------------------
| SEND SELLER DECISION EMAIL
|--------------------------------------------------------------------------
|
| If RESEND_API_KEY or RESEND_FROM_EMAIL
| is missing, this function simply skips email.
|
*/

export async function sendSellerDecisionEmail({
  to,
  name,
  storeName,
  status,
}) {
  const apiKey =
    process.env.RESEND_API_KEY;

  const from =
    process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "Resend is not configured. Seller decision email skipped."
    );

    return {
      skipped: true,
    };
  }

  const safeName =
    escapeHtml(name);

  const safeStoreName =
    escapeHtml(storeName);

  const approved =
    status === "approved";

  const subject =
    approved
      ? "Your ThriftMatch seller application was approved"
      : "Update on your ThriftMatch seller application";

  const html =
    approved
      ? `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Your seller application is approved.</h2>

          <p>
            Hi ${safeName},
          </p>

          <p>
            Your store
            <strong>${safeStoreName}</strong>
            has been approved on ThriftMatch.
          </p>

          <p>
            You can now sign in using the same email
            address you used for your application and
            start adding listings.
          </p>

          <p>
            Welcome to ThriftMatch.
          </p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Update on your seller application.</h2>

          <p>
            Hi ${safeName},
          </p>

          <p>
            We've reviewed your seller application for
            <strong>${safeStoreName}</strong>.
          </p>

          <p>
            Unfortunately, your application was not approved
            at this time.
          </p>

          <p>
            Thank you for your interest in ThriftMatch.
          </p>
        </div>
      `;

  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
        }),
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `Resend returned ${response.status}: ${text}`
    );
  }

  return response.json();
}