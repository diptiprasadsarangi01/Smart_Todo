import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";

/* -----------------------------------------
   SMART Y-AXIS SCALE
----------------------------------------- */
const getYAxisConfig = (maxValue) => {
  if (maxValue <= 12) return { ticks: [0, 3, 6, 9, 12], domain: [0, 12] };
  if (maxValue <= 20) return { ticks: [0, 5, 10, 15, 20], domain: [0, 20] };
  if (maxValue <= 50) return { ticks: [0, 10, 20, 30, 40, 50], domain: [0, 50] };

  const step = Math.ceil(maxValue / 5);
  const ticks = Array.from({ length: 6 }, (_, i) => i * step);
  return { ticks, domain: [0, ticks[ticks.length - 1]] };
};

/* -----------------------------------------
   ACTIVE PIE SHAPE (Glow + Pop)
----------------------------------------- */
const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}) => (
  <g>
    {/* Glow ring */}
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="none" 
      activeStrokeWidth={0}
      opacity={0.25}
    />

    {/* Main slice */}
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="none" 
      activeStrokeWidth={0}
    />
  </g>
);

export default function WeeklyAnalytics({
  weeklyData = [],
  priorityData = [],
  loading = false,
  showPriority = true,
  onPrioritySelect,
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const maxValue = Math.max(
    ...weeklyData.map((d) => Math.max(d.completed, d.pending)),
    1
  );

  const { ticks, domain } = getYAxisConfig(maxValue);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ================= WEEKLY BAR CHART ================= */}
      <div className="card-glass p-4 sm:p-6 rounded-xl h-[300px] sm:h-[330px]">
        <h3 className="font-semibold mb-3">Weekly Progress</h3>

        {loading ? (
          <p className="text-white/70">Loading chart...</p>
        ) : (
        <ResponsiveContainer width="100%" height="82%" >
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 15 }}
            >
              <XAxis
                dataKey="day"
                stroke="#fff"
                tick={{ fontSize: 12 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                stroke="#fff"
                ticks={ticks}
                domain={domain}
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="hidden sm:block"
              />

                {/* Enhanced tooltip */}
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,15,0.9)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />

              <Bar dataKey="completed" fill="#22c55e" barSize={12} />
              <Bar dataKey="pending" fill="#eab308" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#22c55e]" />
            completed
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#eab308]" />
            pending
          </div>
        </div>
      </div>

      {/* ================= PRIORITY PIE ================= */}
      {showPriority && (
        <div className="card-glass p-4 sm:p-6 rounded-xl h-[300px] sm:h-[330px]">
          <h3 className="font-semibold mb-3">Tasks by Priority</h3>

          {loading ? (
            <p className="text-white/70">Loading priority...</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    activeIndex={activeIndex}                    
                    activeShape={renderActiveShape}
                    stroke="none"
                    activeStrokeWidth={0}
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={(d) =>
                      onPrioritySelect?.(d?.name?.toLowerCase() || null)
                    }
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  {/* COUNT tooltip (not %) */}
                  <Tooltip
                    formatter={(value, name) => [`${value} tasks`, name]}
                    contentStyle={{
                      background: "rgba(15,15,15,0.9)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Clickable legend */}
              <div className="flex justify-center gap-6 mt-3 text-sm">
                {priorityData.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
                    onClick={() =>
                      onPrioritySelect?.(p.name.toLowerCase())
                    }
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
