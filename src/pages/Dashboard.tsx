// components/chartcard.tsx
import { useState, useEffect, useRef } from "react";
import type { Chart as ChartInstance } from "chart.js";

type ChartTab = "revenue" | "orders" | "users";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const CHART_DATA: Record<ChartTab, number[]> = {
  revenue: [42000, 55000, 48000, 67000, 74000, 84000],
  orders:  [320,   410,   380,   520,   610,   700],
  users:   [1800,  2100,  2400,  2700,  3100,  3800],
};

const TABS: { key: ChartTab; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "orders",  label: "Orders"  },
  { key: "users",   label: "Users"   },
];

export function ChartCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ Typed as ChartInstance | null — no more unknown casts
  const chartRef = useRef<ChartInstance | null>(null);

  const [activeTab, setActiveTab] = useState<ChartTab>("revenue");

  useEffect(() => {
    import("chart.js/auto").then(({ default: Chart }) => {
      if (!canvasRef.current) return;

      // ✅ Destroy and null BEFORE creating — prevents "Canvas is already in use" error
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: MONTHS,
          datasets: [
            {
              data: CHART_DATA[activeTab],
              borderColor: "#534AB7",
              borderWidth: 2,
              backgroundColor: "rgba(83,74,183,0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 5,
              pointBackgroundColor: "#534AB7",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false } },
            y: { grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false } },
          },
        },
      });
    });

    // ✅ Cleanup on unmount — optional chaining handles null safely
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [activeTab]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-900">Revenue over time</h2>
          <p className="text-xs text-gray-400 mt-0.5">Jan – Jun 2025</p>
        </div>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                activeTab === t.key
                  ? "bg-gray-100 text-gray-900 border-gray-300"
                  : "text-gray-400 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-44">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}