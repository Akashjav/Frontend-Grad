import type * as React from "react";
import Card from "./Card";

export default function StatCard({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>{value}</p>
          {delta && <p className="text-xs text-emerald-600 mt-1 font-medium">↑ {delta} this month</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">{icon}</div>
      </div>
    </Card>
  );
}

