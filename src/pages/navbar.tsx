import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const location = useLocation();
  // const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [themeFromStorage, setThemeFromStorage] = useState<"light" | "dark">(
    "light"
  );

  const disabledButton = currentPath.includes("/set-password");

  useEffect(() => {
    // Read from localStorage
    const storedTheme = localStorage.getItem("vite-ui-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setThemeFromStorage(storedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeFromStorage(systemPrefersDark ? "dark" : "light");
    }

    setCurrentPath(location.pathname);
  }, [location]);

  const signUpLink = useMemo(() => {
    if (currentPath.includes("/login")) {
      return { to: "/sign-up", title: "Sign-Up" };
    } else if (currentPath.includes("/forget-password")) {
      return { to: "/login", title: "Sign-In" };
    } else {
      return { to: "/login", title: "Sign-In" };
    }
  }, [currentPath]);

  const logoUrl =
    themeFromStorage === "light"
      ? "https://cdn.algohire.ai/static/logos/algohire-logo-dark.svg"
      : "https://cdn.algohire.ai/static/logos/algohire-logo-light.svg";

  return (
    <header className="flex w-full items-center justify-between p-4">
      <div className="flex items-center">
        <img src={logoUrl} className="max-h-11" alt="Algohire Logo" />
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://algohire.ai/contact-us"
          target="_blank"
          className="hidden md:block"
        >
          <Button variant="ghost">Support</Button>
        </a>
        {!disabledButton && (
          <Link className="font-medium" to={signUpLink.to}>
            <Button variant="outline">{signUpLink.title}</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
