import env from "@/lib/env";
import { useState, useEffect } from "react";

import type { Country } from "react-phone-number-input";

export interface GeoIpData {
  ip: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  time_zone: string;
  country: Country;
  // Add other properties based on the actual API response
}

const useGeoIpData = (): GeoIpData | null => {
  const [geoIpData, setGeoIpData] = useState<GeoIpData | null>(null);

  useEffect(() => {
    const fetchGeoIpData = async () => {
      const cachedData = localStorage.getItem("geoIpData");
      const cachedTimestamp = localStorage.getItem("geoIpDataTimestamp");
      const oneDay = 24 * 60 * 60 * 1000;

      if (
        cachedData &&
        cachedTimestamp &&
        new Date().getTime() - parseInt(cachedTimestamp, 10) < oneDay
      ) {
        setGeoIpData(JSON.parse(cachedData) as GeoIpData);
      } else {
        try {
          const response = await fetch(env.urls.ipv4Check);
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
          }
          const result: GeoIpData = await response.json();
          localStorage.setItem("geoIpData", JSON.stringify(result));
          localStorage.setItem(
            "geoIpDataTimestamp",
            new Date().getTime().toString()
          );
          setGeoIpData(result);
        } catch (error) {
          console.error("Failed to fetch GeoIP data:", error);
        }
      }
    };

    fetchGeoIpData();
  }, []);

  return geoIpData;
};

export default useGeoIpData;
