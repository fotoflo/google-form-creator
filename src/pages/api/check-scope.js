import { getToken } from "next-auth/jwt";
import { google } from "googleapis";

export default async function handler(req, res) {
  const { scope } = req.query;

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.accessToken) {
      return res.status(401).json({ hasScope: false });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken });

    // Verify the token and check its scopes
    const tokenInfo = await oauth2Client.getTokenInfo(token.accessToken);
    const hasScope = tokenInfo.scopes.includes(scope);

    return res.status(200).json({ hasScope });
  } catch (error) {
    console.error("Error checking scope:", error);
    return res.status(500).json({ hasScope: false });
  }
}
