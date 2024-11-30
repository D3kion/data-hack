import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { useAuth } from "@/entities/auth";
import { Header } from "./header";

export function AuthLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // !isRefreshing/isLoading &&
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
