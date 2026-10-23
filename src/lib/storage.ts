import { useCallback, useEffect, useRef, useState } from "react";
import { createDefaultProfile, normalizeProfile } from "@/lib/profile";
import type { Locale, Profile } from "@/domain/types";

const PROFILE_KEY = "hsp-points-profile:v1";
const LOCALE_KEY = "hsp-points-locale";

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return createDefaultProfile();
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable (private mode, quota). The calculator still works.
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}

export function loadLocale(): Locale | null {
  try {
    const value = localStorage.getItem(LOCALE_KEY);
    return value === "ja" || value === "en" || value === "zh-Hant"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Ignore unavailable storage.
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveProfile(profile);
    setSavedAt(new Date());
  }, [profile]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === PROFILE_KEY) {
        setProfile(loadProfile());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile(createDefaultProfile());
    setSavedAt(new Date());
  }, []);

  return { profile, setProfile, reset, savedAt };
}
