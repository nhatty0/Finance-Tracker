import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const ExpenseChart = ({ transactions }) => {
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const category = acc.find((c) => c.name === t.tag);
      if (category) {
        category.value += t.amount;
      } else {
        acc.push({ name: t.tag, value: t.amount });
      }
      return acc;
    }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6384",
    "#36A2EB",
  ];

  return (
    <div>
      {" "}
      {/* Added a wrapping div */}
      <div className="text-sm font-semibold mb-2 text-gray-600">
        {" "}
        {/* Moved the title outside */}
        Expenses by Category
      </div>
      <ResponsiveContainer width="100%" height={250}>
        {" "}
        {/* Increased height */}
        <PieChart>
          <Pie
            data={expenseData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {expenseData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
