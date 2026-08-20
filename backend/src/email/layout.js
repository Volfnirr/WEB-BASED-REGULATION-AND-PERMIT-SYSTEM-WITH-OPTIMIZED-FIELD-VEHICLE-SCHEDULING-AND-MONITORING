export function emailLayout({ title, bodyHtml }) {
  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a5d1a;">PENRO Portal</h2>
      <h3>${title}</h3>
      ${bodyHtml}
      <p style="color: #888; font-size: 12px; margin-top: 30px;">
        This is an automated message from PENRO Portal. Please do not reply.
      </p>
    </div>
  `;
}
