import { useState, useEffect } from "react";

export function useBrowserTimezone() {
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz || "Unknown Timezone");
    } catch {
      setTimezone("Unknown Timezone");
    }
  }, []);

  return timezone;
}
