"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { chapterRoute } from "../runtime/chapter/chapterRegistry";
import { grantAct3PreviewEntry } from "../game/act3PreviewAccess";

/**
 * Intentionally visible in Vuxenläge on both native and web child clients.
 * A separate passcode prompt prevents accidental story spoilers.
 */
export function Act3PreviewLauncher() {
  const router = useRouter();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function enterPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!grantAct3PreviewEntry(password, window.sessionStorage)) {
      setError("Fel lösenord. Försök igen.");
      setPassword("");
      return;
    }
    setError("");
    setPassword("");
    router.push(chapterRoute("act3"));
  }

  return (
    <div className="parent-menu-footer">
      <span>AKT 3 · FÖRHANDSVISNING</span>
      <button
        className="secondary-button"
        type="button"
        aria-expanded={passwordOpen}
        onClick={() => {
          setPasswordOpen((open) => !open);
          setPassword("");
          setError("");
        }}
      >
        X
      </button>
      {passwordOpen && (
        <form onSubmit={enterPreview}>
          <label htmlFor="act3-preview-password">Lösenord för Akt 3</label>
          <input
            id="act3-preview-password"
            className="dog-name-input"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="go"
            required
          />
          {error && <p role="alert">{error}</p>}
          <button className="primary-button" type="submit">Öppna Akt 3</button>
        </form>
      )}
    </div>
  );
}
