export type Language = "fr" | "en";

export type NewsItem = {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  image_paths: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
  };
};

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "") ??
  "https://nrifrzycijiexgrutgam.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const SESSION_KEY = "whtl-admin-session";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function request<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error("La clé publique Supabase n'est pas encore configurée.");
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || payload?.error_description || payload?.error || "Erreur Supabase.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getStoredSession(): AuthSession | null {
  const value = window.localStorage.getItem(SESSION_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession | null) {
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export async function signIn(email: string, password: string) {
  const session = await request<AuthSession>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  storeSession(session);
  return session;
}

export async function signOut(accessToken: string) {
  await request<void>("/auth/v1/logout", { method: "POST" }, accessToken).catch(() => undefined);
  storeSession(null);
}

export async function listNews(includeDrafts = false, accessToken?: string) {
  const filter = includeDrafts ? "" : "&published=eq.true";
  return request<NewsItem[]>(
    `/rest/v1/news?select=*&order=created_at.desc${filter}`,
    {},
    accessToken,
  );
}

export async function createNews(
  news: Omit<NewsItem, "id" | "created_at" | "updated_at">,
  accessToken: string,
) {
  const rows = await request<NewsItem[]>(
    "/rest/v1/news",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(news),
    },
    accessToken,
  );
  return rows[0];
}

export async function updateNews(
  id: string,
  news: Partial<Omit<NewsItem, "id" | "created_at" | "updated_at">>,
  accessToken: string,
) {
  const rows = await request<NewsItem[]>(
    `/rest/v1/news?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(news),
    },
    accessToken,
  );
  return rows[0];
}

export async function deleteNews(id: string, accessToken: string) {
  await request<void>(
    `/rest/v1/news?id=eq.${encodeURIComponent(id)}`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } },
    accessToken,
  );
}

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadNewsImages(files: File[], accessToken: string) {
  const paths: string[] = [];

  for (const file of files) {
    const path = `${crypto.randomUUID()}-${safeFileName(file.name)}`;
    await request<Record<string, unknown>>(
      `/storage/v1/object/news-images/${encodeURIComponent(path)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: file,
      },
      accessToken,
    );
    paths.push(path);
  }

  return paths;
}

export async function deleteNewsImages(paths: string[], accessToken: string) {
  if (!paths.length) return;
  await request<void>(
    "/storage/v1/object/news-images",
    {
      method: "DELETE",
      body: JSON.stringify({ prefixes: paths }),
    },
    accessToken,
  );
}

export function newsImageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/news-images/${path}`;
}

export async function listAdminProfiles(accessToken: string) {
  return request<AdminProfile[]>(
    "/rest/v1/admin_profiles?select=*&order=created_at.desc",
    {},
    accessToken,
  );
}

export async function createAdminUser(
  email: string,
  password: string,
  fullName: string,
  accessToken: string,
) {
  return request<{ user: AdminProfile }>(
    "/functions/v1/create-admin",
    {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    },
    accessToken,
  );
}
