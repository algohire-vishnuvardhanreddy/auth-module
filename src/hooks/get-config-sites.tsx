import { firebaseApp } from "@/services/firebase";
import { useQuery } from "@tanstack/react-query";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";

async function fetchAuthSites() {
  const remoteConfig = getRemoteConfig(firebaseApp);

  // Optional: set minimum fetch interval (in milliseconds)
  // remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

  await fetchAndActivate(remoteConfig);

  const sitesString = getValue(remoteConfig, "auth_available_sites").asString();
  const parsedSites = JSON.parse(sitesString);

  return parsedSites;
}

export function useAuthSites() {
  const {
    data: sites,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authSites"],
    queryFn: fetchAuthSites,
    select: (data) => {
      const host = typeof window !== "undefined" ? window.location.host : "";
      const currentSite = data
        ? // @ts-ignore fgd
          Object.values(data).find((site) => site.host === host)
        : null;
      return { sites: data, currentSite };
    },
  });

  return { sites, isLoading, error };
}
