"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

let settingsRequest: Promise<Record<string, string>> | undefined;

function loadSiteSettings() {
  if (!settingsRequest) {
    settingsRequest = apiRequest<Record<string, string>>("content/settings/public")
      .catch((error: unknown) => {
        settingsRequest = undefined;
        throw error;
      });
  }

  return settingsRequest;
}

export function useSiteSettings(enabled = true) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    loadSiteSettings()
      .then((result) => {
        if (active) setSettings(result);
      })
      .catch(() => {
        if (active) setSettings({});
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return settings;
}
