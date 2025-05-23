import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./WidgetStyles.css";

interface ChartWidgetProps {
  chartType: "bar" | "line" | "pie";
  data: number[];
  title: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF194F",
];

const ChartWidget: React.FC<ChartWidgetProps> = ({
  chartType,
  data,
  title,
}) => {
  const chartData = data.map((val, index) => ({
    name: `Item ${index + 1}`,
    value: val,
  }));

  const renderChart = () => {
    const hasValidData = data && data.length > 0 && data.some((val) => val > 0);

    if (!hasValidData) {
      return <p>No valid data to display for this chart.</p>;
    }

    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${entry?.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return <p>Unsupported Chart Type</p>;
    }
  };

  return (
    <div className="widget-content chart-widget">
      <h4>{title || "Chart Widget"}</h4>
      <ResponsiveContainer width="100%" height="80%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;
