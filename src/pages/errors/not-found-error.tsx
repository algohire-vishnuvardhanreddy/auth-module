import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFoundError() {
  const navigate = useNavigate();
  const location = useLocation();

  const title = location.state?.title || "Page Not Found";
  const description =
    location.state?.description ||
    "The page you're looking for doesn't exist or has been moved.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 transition-colors dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400 dark:text-gray-500"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-center text-xl font-semibold dark:text-white">
          {title}
        </h1>
        <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <Button
          className="w-full bg-black text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          onClick={() => navigate("/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
