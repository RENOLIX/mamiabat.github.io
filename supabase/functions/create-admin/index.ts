import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://whtl-dz.com",
  "https://www.whtl-dz.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") ?? "https://whtl-dz.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://whtl-dz.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders(request), "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = request.headers.get("Authorization");

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
      throw new Error("Missing Supabase environment configuration.");
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.full_name ?? "").trim();

    if (!email || !email.includes("@")) {
      throw new Error("A valid email is required.");
    }

    if (password.length < 10) {
      throw new Error("The password must contain at least 10 characters.");
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          created_at: data.user.created_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      },
    );
  } catch (reason) {
    const message = reason instanceof Error ? reason.message : String(reason);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders(request), "Content-Type": "application/json" },
    });
  }
});
