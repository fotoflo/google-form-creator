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

export const requestScope = async (scope) => {
  return signIn("google", {
    callbackUrl: window.location.href,
    scope: scope,
    prompt: "consent",
    access_type: "offline",
  });
};

export const ensureScope = async (scope) => {
  const hasScope = await checkScope(scope);
  if (!hasScope) {
    await requestScope(scope);
    return false;
  }
  return true;
};
