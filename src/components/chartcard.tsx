import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  ScatterChart,
  Scatter
} from "recharts";

import {
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  
  Info
} from "lucide-react";

/* -------------------------------------------------- */
/* Types */
/* -------------------------------------------------- */

export type ChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "radar"
  | "composed"
  | "scatter";

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: any;
}

export interface ChartSeries {
  key: string;
  name: string;
  color: string;
  type?: "line" | "area" | "bar" | "scatter";
}

export interface ChartCardProps {
  title: string;
  description?: string;
  type: ChartType;
  data: ChartDataPoint[];
  series?: ChartSeries[];
  height?: number;
  isLoading?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

/* -------------------------------------------------- */
/* Colors */
/* -------------------------------------------------- */

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316"
];

/* -------------------------------------------------- */
/* Tooltip */
/* -------------------------------------------------- */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg shadow p-3">
      <p className="text-sm font-medium mb-2">{label}</p>

      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex gap-2 text-xs items-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------------------------- */
/* Empty State */
/* -------------------------------------------------- */

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
    <Info className="w-10 h-10 text-gray-400 mb-2" />
    <p className="text-sm text-gray-500">No data available</p>
  </div>
);

/* -------------------------------------------------- */
/* Stat Badge */
/* -------------------------------------------------- */

const StatBadge = ({
  label,
  value,
  trend
}: {
  label: string;
  value: number | string;
  trend?: number;
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">{value}</span>

        {trend !== undefined && (
          <span
            className={`flex items-center text-xs ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* ChartCard */
/* -------------------------------------------------- */

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  type,
  data,
  series = [],
  height = 300,
  isLoading = false
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const visibleSeries = series.filter((s) => !hiddenSeries.includes(s.key));

  /* summary */

  const total = data.reduce((a, b) => a + (b.value || 0), 0);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
        Loading chart...
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 border rounded-xl shadow ${
        fullscreen ? "fixed inset-4 z-50 p-6" : ""
      }`}
    >
      {/* Header */}

      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>

          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button className="p-2 hover:bg-gray-100 rounded">
            <RefreshCw size={16} />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        <StatBadge label="Total" value={total} />
        <StatBadge label="Entries" value={data.length} />
      </div>

      {/* Chart */}

      <div className="p-6">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <>
              {/* LINE */}

              {type === "line" && (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {visibleSeries.map((s, i) => (
                    <Line
                      key={s.key}
                      dataKey={s.key}
                      stroke={s.color || COLORS[i]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              )}

              {/* AREA */}

              {type === "area" && (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {visibleSeries.map((s, i) => (
                    <Area
                      key={s.key}
                      dataKey={s.key}
                      stroke={s.color || COLORS[i]}
                      fill={s.color || COLORS[i]}
                      fillOpacity={0.3}
                    />
                  ))}
                </AreaChart>
              )}

              {/* BAR */}

              {type === "bar" && (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {visibleSeries.map((s, i) => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      fill={s.color || COLORS[i]}
                    />
                  ))}
                </BarChart>
              )}

              {/* PIE */}

              {type === "pie" && (
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" label>
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              )}

              {/* RADAR */}

              {type === "radar" && (
                <RadarChart data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />

                  {visibleSeries.map((s, i) => (
                    <Radar
                      key={s.key}
                      dataKey={s.key}
                      stroke={s.color || COLORS[i]}
                      fill={s.color || COLORS[i]}
                      fillOpacity={0.6}
                    />
                  ))}

                  <Legend />
                  <Tooltip />
                </RadarChart>
              )}

              {/* SCATTER */}

              {type === "scatter" && (
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="x" />
                  <YAxis dataKey="y" />
                  <Tooltip />
                  <Legend />

                  {visibleSeries.map((s, i) => (
                    <Scatter
                      key={s.key}
                      data={data}
                      fill={s.color || COLORS[i]}
                    />
                  ))}
                </ScatterChart>
              )}

              {/* COMPOSED */}

              {type === "composed" && (
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {visibleSeries.map((s, i) => (
                    <Line
                      key={s.key}
                      dataKey={s.key}
                      stroke={s.color || COLORS[i]}
                    />
                  ))}
                </ComposedChart>
              )}
            </>
          </ResponsiveContainer>
        )}
      </div>

      {/* Series Toggle */}

      {series.length > 0 && (
        <div className="flex flex-wrap gap-4 px-6 pb-4">
          {series.map((s, i) => (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className={`flex items-center gap-2 text-sm ${
                hiddenSeries.includes(s.key) ? "opacity-50" : ""
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color || COLORS[i] }}
              />

              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------- */
/* Prebuilt Variants */
/* -------------------------------------------------- */

export const RevenueChart = (props: any) => (
  <ChartCard type="area" title="Revenue Overview" {...props} />
);

export const UserGrowthChart = (props: any) => (
  <ChartCard type="line" title="User Growth" {...props} />
);

export const SalesDistributionChart = (props: any) => (
  <ChartCard type="pie" title="Sales Distribution" {...props} />
);

export const TrafficSourcesChart = (props: any) => (
  <ChartCard type="bar" title="Traffic Sources" {...props} />
);