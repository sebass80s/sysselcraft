import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseClient";

export type BackendAuthState = {
  signedIn: boolean;
  isAnonymous: boolean;
  userId: string | null;
};

function toBackendAuthState(session: Session | null): BackendAuthState {
  return {
    signedIn: Boolean(session),
    isAnonymous: Boolean(session?.user.is_anonymous),
    userId: session?.user.id ?? null,
  };
}

export async function getBackendAuthState(): Promise<BackendAuthState> {
  const { data, error } = await getSupabaseBrowserClient().auth.getSession();
  if (error) throw error;
  return toBackendAuthState(data.session);
}

export function subscribeBackendAuth(listener: (state: BackendAuthState) => void): () => void {
  const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((_event, session) => {
    listener(toBackendAuthState(session));
  });
  return () => data.subscription.unsubscribe();
}

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

  const currentSession = sessionData.session;
  if (currentSession?.user.id) {
    if (!currentSession.user.is_anonymous) {
      throw new Error("Den här webbläsaren är inloggad som förälder. Öppna barnparningen på barnets enhet eller i ett privat fönster.");
    }
    return currentSession.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user?.id) throw new Error("Supabase did not return a child session user.");
  return data.user.id;
}

export async function signOutBackendSession(): Promise<void> {
  const { error } = await getSupabaseBrowserClient().auth.signOut();
  if (error) throw error;
}
