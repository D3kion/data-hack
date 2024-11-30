import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(!!localStorage.getItem("authed"));

  function login() {
    localStorage.setItem("authed", "true");
    setUser(true);
  }

  function logout() {
    localStorage.removeItem("authed");
    setUser(false);
  }

  return { user, login, logout };
}
