"use client";

import dynamic from "next/dynamic";
import React from "react";

const AdminApp = dynamic(() => import("@/modules/admin/AdminApp"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <span className="text-sm font-semibold text-slate-600">Memuat Portal Manajemen DTETI...</span>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminApp />;
}
