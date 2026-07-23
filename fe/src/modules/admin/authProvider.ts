import type { AuthProvider } from "react-admin";
import { API_URL } from "@/lib/api";

const TOKEN_KEY = "kbk-admin-token";
const ADMIN_KEY = "kbk-admin-identity";

type AdminIdentity = {
  id: number;
  username: string;
  role: "ADMIN" | "SUPERADMIN";
};

function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

function saveIdentity(identity: AdminIdentity) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(identity));
}

async function authRequest(path: string, init: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}/${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || "Authentication failed") as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const data = await authRequest("admins/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!data?.token || !data?.admin) {
      throw new Error("Login response did not include an authentication token.");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    saveIdentity(data.admin);
  },

  logout: async () => {
    try {
      await authRequest("admins/logout", { method: "POST" });
    } finally {
      clearSession();
    }
  },

  checkAuth: async () => {
    if (!getToken()) {
      throw new Error("Please sign in to continue.");
    }

    try {
      const identity = await authRequest("admins/me");
      saveIdentity(identity);
    } catch (error) {
      clearSession();
      throw error;
    }
  },

  checkError: async (error) => {
    if ([401, 403].includes(error?.status)) {
      clearSession();
      throw error;
    }
  },

  getIdentity: async () => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored) {
      const identity = JSON.parse(stored) as AdminIdentity;
      return {
        id: identity.id,
        fullName: identity.username,
        role: identity.role,
      };
    }

    const identity = (await authRequest("admins/me")) as AdminIdentity;
    saveIdentity(identity);
    return {
      id: identity.id,
      fullName: identity.username,
      role: identity.role,
    };
  },

  getPermissions: async () => {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (!stored) return null;
    return (JSON.parse(stored) as AdminIdentity).role;
  },
};

export function getAdminToken(): string | null {
  return getToken();
}
