// Cloudflare Email Worker
// Receives email patches and forwards them to GitHub repository_dispatch
//
// Setup:
// 1. Create a Cloudflare Email Worker at dash.cloudflare.com > Workers & Pages
// 2. Add an email route: nvidia.ezmirror.net -> this worker
// 3. Set secrets: GITHUB_TOKEN, GITHUB_REPO
//    wrangler secret put GITHUB_TOKEN   (a fine-grained PAT with contents:write)
//    wrangler secret put GITHUB_REPO     (e.g. Netplayz/nvidia-open-letter)

export default {
  async email(message, env, ctx) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const GITHUB_REPO = env.GITHUB_REPO; // e.g. "Netplayz/nvidia-open-letter"

    const from = message.from;
    const subject = message.headers.get("subject") || "";
    const rawBody = await new Response(message.raw).text();

    // Extract the plain text body from the raw MIME message
    const body = extractPlainText(rawBody);

    // Try to extract a .patch attachment
    const patch = extractPatchAttachment(rawBody);

    // Parse signature details from the email body
    // Expected format (one per line):
    //   Name: Jane Doe
    //   Title: Senior Linux Engineer
    //   Affiliation: Red Hat
    //   GitHub: @janedoe (optional, use "N/A" or omit)
    const signature = parseSignature(body);

    let payload;

    if (patch) {
      // Full git patch attached
      payload = {
        event_type: "email-patch",
        client_payload: {
          patch_content: patch,
          from_email: from,
          subject: subject,
        },
      };
    } else if (signature.name && signature.title && signature.affiliation) {
      // Signature details parsed from body
      payload = {
        event_type: "email-patch",
        client_payload: {
          signer_name: signature.name,
          signer_title: signature.title,
          signer_affiliation: signature.affiliation,
          signer_github: signature.github || "N/A",
          from_email: from,
          subject: subject,
        },
      };
    } else {
      // Could not parse -- send error reply
      await message.reply({
        headers: {
          "Auto-Submitted": "auto-replied",
        },
        subject: `Re: ${subject}`,
        text: `Thanks for your email!

We couldn't parse your signature. Please reply with one of these formats:

--- Option 1: Signature details ---
Name: Your Full Name
Title: Your Job Title
Affiliation: Your Company or "Independent"
GitHub: @yourhandle (optional)

--- Option 2: Git patch ---
Attach a .patch file created with: git format-patch -1 HEAD

See https://github.com/Netplayz/nvidia-open-letter/blob/main/CONTRIBUTING.md for details.`,
      });
      return;
    }

    // Send to GitHub
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      await message.reply({
        headers: { "Auto-Submitted": "auto-replied" },
        subject: `Re: ${subject}`,
        text: `Thanks for signing the open letter!

Your signature has been submitted and will appear on the site shortly.

Signed,
The NVIDIA Open Letter Team
https://netplayz.github.io/nvidia-open-letter/`,
      });
    } else {
      const err = await res.text();
      await message.reply({
        headers: { "Auto-Submitted": "auto-replied" },
        subject: `Re: ${subject}`,
        text: `Sorry, there was an error processing your signature. Please try again or sign via GitHub:

https://github.com/Netplayz/nvidia-open-letter

Error: ${res.status} ${err}`,
      });
    }
  },
};

function extractPlainText(rawMime) {
  // Simple MIME plain text extraction
  const parts = rawMime.split(/--[^\r\n]+/g);
  for (const part of parts) {
    if (part.includes("Content-Type: text/plain")) {
      const lines = part.split("\n");
      const start = lines.findIndex((l) => l.trim() === "");
      if (start !== -1) {
        return lines.slice(start + 1).join("\n").trim();
      }
    }
  }
  // Fallback: return everything after first blank line
  const idx = rawMime.indexOf("\n\n");
  return idx !== -1 ? rawMime.slice(idx + 2).trim() : rawMime;
}

function extractPatchAttachment(rawMime) {
  // Look for a .patch or .diff attachment
  const patchRegex =
    /Content-Disposition:[^;]*;\s*filename="([^"]*\.patch)"/gi;
  let match;
  while ((match = patchRegex.exec(rawMime)) !== null) {
    // Find the base64 content after headers
    const start = rawMime.indexOf("\n\n", match.index) + 2;
    const end = rawMime.indexOf("--", start);
    const base64 = rawMime.slice(start, end).replace(/\s/g, "");
    try {
      return atob(base64);
    } catch {
      continue;
    }
  }
  return null;
}

function parseSignature(body) {
  const result = {};
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const nameMatch = trimmed.match(/^name:\s*(.+)/i);
    const titleMatch = trimmed.match(/^(?:title|role|job):\s*(.+)/i);
    const affMatch = trimmed.match(
      /^(?:affiliation|org|company|employer):\s*(.+)/i
    );
    const ghMatch = trimmed.match(
      /^(?:github|gh|handle):\s*(.+)/i
    );
    if (nameMatch) result.name = nameMatch[1].trim();
    if (titleMatch) result.title = titleMatch[1].trim();
    if (affMatch) result.affiliation = affMatch[1].trim();
    if (ghMatch) result.github = ghMatch[1].trim();
  }
  return result;
}
