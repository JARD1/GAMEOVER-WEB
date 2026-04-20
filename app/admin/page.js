"use client";

import { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <section className="section-shell py-16">
      {isAuthenticated ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      )}
    </section>
  );
}
