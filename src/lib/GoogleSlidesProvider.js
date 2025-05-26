/** @type {import("next-auth/providers").OAuthConfig} */
/** @type {import("next-auth/providers").OAuthUserConfig} */

// No explicit interface needed for JS, JSDoc can help if desired.
// The profile function will map the incoming profile to NextAuth's expected user structure.

export default function GoogleSlidesProvider(options) {
  return {
    id: "google-slides", // Unique ID for this provider
    name: "Google Slides",
    type: "oauth",
    wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    authorization: {
      params: {
        scope:
          "openid email profile https://www.googleapis.com/auth/presentations",
        // prompt: "consent", // Consider if needed here or rely on main NextAuth config
        // access_type: "offline", // Consider if needed here or rely on main NextAuth config
      },
    },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      // The profile object structure from Google needs to be mapped to
      // NextAuth's expected user object structure.
      // 'sub' is the standard field for user ID.
      // 'picture' might be available for an avatar.
      // Ensure all necessary fields for NextAuth user object are present.
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        // Potentially add other fields from profile if needed by your app
        // e.g., profile.given_name, profile.family_name
      };
    },
    // Spread the options to allow overriding clientId, clientSecret, etc.
    ...options,
  };
}
