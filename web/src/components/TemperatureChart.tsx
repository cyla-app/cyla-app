import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import React from "react";
import { Day } from "../generated/day";

type PropsType = { days: Day[] };

export default ({ days }: PropsType) => {
  return (
    <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
      <LineChart
        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
        data={days.map((day, i) => ({
          date: day.date,
          temperature: Math.round(day.temperature?.value!! * 100) / 100,
        }))}
      >
        <XAxis
          angle={-45}
          textAnchor="end"
          dataKey="date"
          tickFormatter={(date) => {
            if (date === "auto") {
              return date;
            }
            return format(new Date(date), "dd-MM-yyyy");
          }}
        />
        <YAxis domain={[36, 38]} />
        <Tooltip />
        <Line
          type="monotone"
          name={"Basal Temperature"}
          dataKey="temperature"
          stroke="#00075E"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
