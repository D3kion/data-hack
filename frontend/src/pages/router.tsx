import { BrowserRouter, Route, Routes } from "react-router";

import { AuthLayout, ProtectedLayout } from "@/widgets/layout";

import LoginPage from "./auth/login";
import LakeListPage from "./lake/list";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
        {/* PROTECTED ROUETS */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<LakeListPage />} />
          <Route path="lake" element={<LakeListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
