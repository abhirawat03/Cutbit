export const resetPasswordTemplate = (resetUrl) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#0f172a;font-family:Arial, sans-serif;">

    <table width="100%" style="padding:20px;">
      <tr>
        <td align="center">

          <table width="500" style="background:#1e293b;border-radius:10px;padding:30px;color:#e2e8f0;">

            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0;color:#3b82f6;">Cutbit</h2>
              </td>
            </tr>

            <tr>
              <td>
                <h3>Reset your password</h3>
                <p style="font-size:14px;">
                  Click below to reset your password. This link expires in 15 minutes.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="${resetUrl}"
                  style="background:#2563eb;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;">
                  Reset Password
                </a>
              </td>
            </tr>

            <tr>
              <td style="font-size:12px;">
                Or paste this link:
                <br/>
                <a href="${resetUrl}">${resetUrl}</a>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
