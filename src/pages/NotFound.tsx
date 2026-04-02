import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        <div className="space-y-4">
          <img src="/carambar-logo.png" alt="Carambar" className="mx-auto h-12 w-auto" />
          <h1 className="text-6xl font-bold carambar-gradient-text">404</h1>
          <p className="text-xl text-muted-foreground">Oops! This page doesn’t exist.</p>
          <Button asChild className="rounded-full carambar-gradient-bg border-0 text-primary-foreground">
            <a href="/">Back to home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
