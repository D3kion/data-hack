import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/shared/ui-kit";
import { useAuth } from "@/entities/auth";

import { Header } from "./header";

export function ProtectedLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // !refresh &&
    if (!user) {
      // TODO: preserve url in search params
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <nav className="border-r min-w-[320px] p-6 pt-4 flex flex-col justify-between max-lg:hidden">
          <div className="flex flex-col items-start">
            <Button variant="link" asChild>
              <Link to="/lake">Сырые данные</Link>
            </Button>
            <Button variant="link" disabled>
              Хранилище
            </Button>
            <Button variant="link" disabled>
              Витрины
            </Button>
            <Button variant="link" asChild>
              <Link to="/dash">Отчеты</Link>
            </Button>
          </div>
          <div>
            <Button variant="link" onClick={logout}>
              <LogOutIcon /> Выйти
            </Button>
          </div>
        </nav>
        <main className="flex-1 flex flex-col py-4 px-6 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
