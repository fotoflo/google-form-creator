import { signIn, getSession } from "next-auth/react";

export const SCOPES = {
  FORMS: "https://www.googleapis.com/auth/forms",
  SLIDES: "https://www.googleapis.com/auth/presentations",
  DRIVE: "https://www.googleapis.com/auth/drive",
};

export const checkScope = async (requiredScope) => {
  const session = await getSession();
  if (!session?.accessToken) return false;

  try {
    const response = await fetch(`/api/check-scope?scope=${requiredScope}`);
    const { hasScope } = await response.json();
    return hasScope;
  } catch (error) {
    console.error("Error checking scope:", error);
    return false;
  }
};

export const requestScope = async (newScope) => {
  if (newScope === SCOPES.SLIDES) {
    console.log("Requesting scope via custom 'google-slides' provider");
    return signIn("google-slides", {
      callbackUrl: window.location.href,
      // Scope is defined within the google-slides provider itself
      // prompt: "select_account consent", // This can be part of provider config or here
    });
  } else {
    // Fallback for other scopes (or original logic if no other custom providers yet)
    console.log(
      `Requesting scope ${newScope} via default 'google' provider with combined scopes`
    );
    const baseScopes = "openid email profile";
    let combinedScope = baseScopes;
    if (newScope && !baseScopes.includes(newScope)) {
      combinedScope = `${baseScopes} ${newScope}`.trim();
    }
    return signIn("google", {
      callbackUrl: window.location.href,
      scope: combinedScope,
      prompt: "select_account consent",
      access_type: "offline",
    });
  }
};

export const ensureScope = async (scope) => {
  const hasScope = await checkScope(scope);
  if (!hasScope) {
    console.log(`Scope ${scope} not found, requesting...`);
    await requestScope(scope);
    return false; // Indicate that a redirect for scope request was initiated
  }
  console.log(`Scope ${scope} already present.`);
  return true;
};
