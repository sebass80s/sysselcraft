import { getSupabaseBrowserClient } from "./supabaseClient";

export async function sendParentMagicLink(email: string, redirectTo?: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error("Email is required.");

  const { error } = await getSupabaseBrowserClient().auth.signInWithOtp({
    email: normalizedEmail,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });

  if (error) throw error;
}

export async function ensureChildAnonymousSession(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session?.user.id) return sessionData.session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user?.id) throw new Error("Supabase did not return a child session user.");
  return data.user.id;
}

export async function signOutBackendSession(): Promise<void> {
  const { error } = await getSupabaseBrowserClient().auth.signOut();
  if (error) throw error;
}
