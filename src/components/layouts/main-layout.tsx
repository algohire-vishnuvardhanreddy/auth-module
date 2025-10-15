import { Outlet } from "react-router";
import { useInitPortal } from "@/hooks/use-portal";
import Providers from "@/providers";

export default function MainLayout() {
  useInitPortal();

  return (
    <Providers>
      <Outlet /> {/* nested pages */}
    </Providers>
  );
}
