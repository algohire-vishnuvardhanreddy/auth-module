import { usePortalStore, type PortalType } from "@/store/portal-store";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export function useInitPortal() {
  const [searchParams] = useSearchParams();
  const setPortal = usePortalStore((state) => state.setPortal);

  useEffect(() => {
    const portal = searchParams.get("portal") as PortalType;
    if (portal) {
      setPortal(portal);
    }
  }, [searchParams, setPortal]);
}
