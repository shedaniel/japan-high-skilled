import type { Profile } from "@/domain/types";
import { normalizeProfile } from "@/lib/profile";

export function parseProfileJson(text: string): Profile {
  const value: unknown = JSON.parse(text);
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Profile JSON must be an object");
  }
  if (!("version" in value) || value.version !== 1) {
    throw new Error("Unsupported profile schema version");
  }
  return normalizeProfile(value);
}

export function downloadProfile(profile: Profile): void {
  const blob = new Blob([JSON.stringify(profile, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "hsp-points-profile-v1.json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
