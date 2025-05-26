import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GoogleSlidesProvider from "../../../lib/GoogleSlidesProvider.js";

// Add this line to help with debugging
console.log(
  "NextAuth configuration loaded with client ID:",
  process.env.GOOGLE_CLIENT_ID ? "Present" : "Missing"
);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GoogleSlidesProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      console.log("--- JWT CALLBACK START ---");
      console.log("Initial token:", JSON.stringify(token, null, 2));
      console.log(
        "Account object from Google (in JWT callback):",
        JSON.stringify(account, null, 2)
      );
      console.log(
        "User object (in JWT callback):",
        JSON.stringify(user, null, 2)
      );
      console.log(
        "Profile object from Google (in JWT callback):",
        JSON.stringify(profile, null, 2)
      );

      if (account) {
        console.log(
          "Account object IS PRESENT in JWT. Updating token from account."
        );
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || token.refreshToken;
        token.expiresAt = Date.now() + (account.expires_in || 3600) * 1000;
        token.idToken = account.id_token;

        if (account.scope) {
          console.log(
            "Scopes from account object (in JWT callback):",
            account.scope
          );
          token.grantedScopes = account.scope;
        } else {
          console.log("No 'scope' field in account object (in JWT callback).");
        }
      } else if (token.expiresAt && Date.now() >= token.expiresAt) {
        console.log(
          "Access token EXPIRED or account object not present in JWT. Attempting refresh."
        );
        return refreshAccessToken(token);
      } else {
        console.log(
          "Access token is VALID and account object not present in JWT. Returning existing token."
        );
      }

      console.log(
        "Final token being returned from JWT:",
        JSON.stringify(token, null, 2)
      );
      console.log("--- JWT CALLBACK END ---");
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.user) session.user = { ...session.user, ...token.user };
      session.error = token.error;
      session.idToken = token.idToken;
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("--- NEXTAUTH SIGNIN EVENT --- Penetration");
      console.log("SignIn Event Message:", JSON.stringify(message, null, 2));
      // message should contain { user, account, profile, isNewUser }
      // We are particularly interested in message.account here.
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
});

// Helper function to refresh the access token
async function refreshAccessToken(token) {
  console.log("--- REFRESH ACCESSTOKEN START ---");
  console.log("Token to refresh:", JSON.stringify(token, null, 2));
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();
    console.log(
      "Refreshed tokens from Google:",
      JSON.stringify(refreshedTokens, null, 2)
    );

    if (!response.ok) {
      console.error(
        "Error in refreshAccessToken response not OK:",
        refreshedTokens
      );
      throw refreshedTokens;
    }

    const newExpiresAt =
      Date.now() + (refreshedTokens.expires_in || 3600) * 1000;
    console.log(
      "New expiry for refreshed token:",
      new Date(newExpiresAt).toISOString()
    );

    const updatedToken = {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: newExpiresAt,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: null,
    };
    console.log(
      "Final token after refresh:",
      JSON.stringify(updatedToken, null, 2)
    );
    console.log("--- REFRESH ACCESSTOKEN END ---");
    return updatedToken;
  } catch (error) {
    console.error("RefreshAccessTokenError Details:", error);
    const errorToken = {
      ...token,
      error: "RefreshAccessTokenError",
    };
    console.log(
      "Token returned on RefreshAccessTokenError:",
      JSON.stringify(errorToken, null, 2)
    );
    console.log("--- REFRESH ACCESSTOKEN END (ERROR) ---");
    return errorToken;
  }
}
